/* Texas Master Systems OS v2.3.1 — AI resilience/model-pack utilities */
export const AI_ASSET_CACHE='tx-ai-assets-v1';
export const WEBLLM_LOCAL_RUNTIME='./vendor/webllm-0.2.85.mjs';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export function hfFileURL(modelBase,path){
  const base=String(modelBase||'').replace(/\/$/,'');
  if(/\/resolve\/[^/]+$/i.test(base))return `${base}/${path}`;
  if(/\/resolve\/[^/]+\/$/i.test(base))return `${base}${path}`;
  return `${base}/resolve/main/${path}`;
}
async function fetchRetry(url,{retries=3,responseType='json'}={}){
  let last;
  for(let i=0;i<retries;i++){
    try{
      const r=await fetch(url,{mode:'cors',credentials:'omit',cache:'no-store'});
      if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);
      return responseType==='json'?await r.json():r;
    }catch(e){last=e;if(i<retries-1)await sleep(500*(i+1));}
  }
  throw new Error(`Fetch failed for ${url}: ${last?.message||last}`);
}
export async function buildModelAssetPlan(record,{runtimeUrls=[]}={}){
  if(!record?.model||!record?.model_lib)throw new Error('Model record lacks model/model_lib URLs');
  const configURL=hfFileURL(record.model,'mlc-chat-config.json');
  const ndarrayURL=hfFileURL(record.model,'ndarray-cache.json');
  const [config,ndarray]=await Promise.all([fetchRetry(configURL),fetchRetry(ndarrayURL)]);
  const tokenizerFiles=Array.isArray(config?.tokenizer_files)?config.tokenizer_files:[];
  const shards=[...new Set((Array.isArray(ndarray?.records)?ndarray.records:[]).map(x=>x?.dataPath).filter(Boolean))];
  const modelFiles=['mlc-chat-config.json','ndarray-cache.json',...tokenizerFiles,...shards];
  const urls=[...runtimeUrls.filter(Boolean),String(record.model_lib),...modelFiles.map(f=>hfFileURL(record.model,f))];
  return {version:1,model_id:record.model_id,model:String(record.model),model_lib:String(record.model_lib),modelFiles,urls:[...new Set(urls)],metadata:{paramBytes:Number(ndarray?.metadata?.ParamBytes||0),shards:shards.length,tokenizerFiles:tokenizerFiles.length}};
}
export async function stagePlanWithServiceWorker(plan,{onProgress,retries=3}={}){
  if(!('serviceWorker'in navigator))throw new Error('Service workers are unavailable');
  const reg=await navigator.serviceWorker.ready;
  const target=navigator.serviceWorker.controller||reg.active||reg.waiting;
  if(!target)throw new Error('No active service worker. Reload once after installation.');
  return await new Promise((resolve,reject)=>{
    const ch=new MessageChannel();
    const timer=setTimeout(()=>reject(new Error('Service-worker staging timed out')),30*60*1000);
    ch.port1.onmessage=e=>{
      const m=e.data||{};
      if(m.type==='AI_STAGE_PROGRESS')onProgress?.(m);
      if(m.type==='AI_STAGE_DONE'){clearTimeout(timer);resolve(m)}
      if(m.type==='AI_STAGE_ERROR'){clearTimeout(timer);reject(new Error(m.error||'AI staging failed'))}
    };
    target.postMessage({type:'AI_STAGE',plan,retries},[ch.port2]);
  });
}
export async function verifyPlan(plan){
  if(!('caches'in window))return{total:plan.urls.length,cached:0,missing:plan.urls.slice()};
  const c=await caches.open(AI_ASSET_CACHE),missing=[];
  let cached=0;
  for(const u of plan.urls){const hit=await c.match(u);if(hit)cached++;else missing.push(u)}
  return{total:plan.urls.length,cached,missing,complete:cached===plan.urls.length};
}
export async function clearPlan(plan){
  const c=await caches.open(AI_ASSET_CACHE);let n=0;
  for(const u of plan.urls)if(await c.delete(u))n++;
  return n;
}
function localFileMap(files){const m=new Map();for(const f of files){m.set(f.name,f);const rel=f.webkitRelativePath||'';if(rel)m.set(rel.split('/').pop(),f)}return m}
function mimeFor(name){if(name.endsWith('.json'))return'application/json';if(name.endsWith('.wasm'))return'application/wasm';if(name.endsWith('.js')||name.endsWith('.mjs'))return'text/javascript';if(name.endsWith('.txt'))return'text/plain';return'application/octet-stream'}
export async function installLocalFolderPack(files,record,{runtimeTarget}={}){
  if(!files?.length)throw new Error('Choose a model-pack folder first');
  const fm=localFileMap(files),cfgFile=fm.get('mlc-chat-config.json'),ndFile=fm.get('ndarray-cache.json');
  if(!cfgFile||!ndFile)throw new Error('Folder must contain mlc-chat-config.json and ndarray-cache.json');
  const [cfg,nd]=await Promise.all([cfgFile.text().then(JSON.parse),ndFile.text().then(JSON.parse)]);
  const tokenFiles=Array.isArray(cfg.tokenizer_files)?cfg.tokenizer_files:[];
  const shards=[...new Set((nd.records||[]).map(x=>x?.dataPath).filter(Boolean))];
  const required=['mlc-chat-config.json','ndarray-cache.json',...tokenFiles,...shards];
  const missing=required.filter(n=>!fm.get(n));
  const libBase=new URL(String(record.model_lib)).pathname.split('/').pop();
  const libFile=fm.get(libBase)||fm.get('model_lib.wasm');
  if(!libFile)missing.push(`${libBase} (or model_lib.wasm)`);
  if(missing.length)throw new Error(`Model pack incomplete. Missing: ${missing.slice(0,12).join(', ')}${missing.length>12?' …':''}`);
  const cache=await caches.open(AI_ASSET_CACHE);let installed=0,bytes=0;
  for(const name of required){const f=fm.get(name),url=hfFileURL(record.model,name);await cache.put(new Request(url,{mode:'cors'}),new Response(f,{headers:{'Content-Type':mimeFor(name),'Content-Length':String(f.size),'Access-Control-Allow-Origin':'*'}}));installed++;bytes+=f.size}
  await cache.put(new Request(record.model_lib,{mode:'cors'}),new Response(libFile,{headers:{'Content-Type':'application/wasm','Content-Length':String(libFile.size),'Access-Control-Allow-Origin':'*'}}));installed++;bytes+=libFile.size;
  const runtime=fm.get('webllm-0.2.85.mjs')||fm.get('webllm-0.2.85.js');
  if(runtime&&runtimeTarget){const target=new URL(runtimeTarget,location.href).href;await cache.put(new Request(target),new Response(runtime,{headers:{'Content-Type':'text/javascript','Content-Length':String(runtime.size)}}));installed++;bytes+=runtime.size}
  const plan={version:1,model_id:record.model_id,model:record.model,model_lib:record.model_lib,modelFiles:required,urls:[record.model_lib,...required.map(n=>hfFileURL(record.model,n))],metadata:{paramBytes:Number(nd?.metadata?.ParamBytes||0),shards:shards.length,tokenizerFiles:tokenFiles.length}};
  localStorage.setItem(`txmaster.aiPack.${record.model_id}`,JSON.stringify({installedAt:new Date().toISOString(),files:installed,bytes,model_id:record.model_id}));
  return{plan,installed,bytes,runtimeInstalled:!!runtime};
}

export async function installHostedPack(record,{baseURL}={}){
  const base=new URL(baseURL||`./models/${encodeURIComponent(record.model_id)}/`,location.href);
  const manifestURL=new URL('pack.json',base).href;
  const mr=await fetch(manifestURL,{cache:'no-store'});if(!mr.ok)throw new Error(`Hosted pack not found (${mr.status}) at ${manifestURL}`);
  const manifest=await mr.json(),files=Array.isArray(manifest.files)?manifest.files:[];
  if(!files.length)throw new Error('Hosted pack manifest contains no files');
  const cache=await caches.open(AI_ASSET_CACHE);let installed=0,bytes=0;
  for(const name of files){
    const src=new URL(name,base).href,r=await fetch(src,{cache:'no-store'});if(!r.ok)throw new Error(`Hosted pack file failed: ${name} (${r.status})`);
    const blob=await r.blob();let target;
    if(name==='model_lib.wasm')target=record.model_lib;else if(name==='webllm-0.2.85.mjs')target=new URL(WEBLLM_LOCAL_RUNTIME,location.href).href;else target=hfFileURL(record.model,name);
    const headers={'Content-Type':mimeFor(name),'Content-Length':String(blob.size),'Access-Control-Allow-Origin':'*'};
    await cache.put(new Request(target,{mode:target.startsWith(location.origin)?'same-origin':'cors'}),new Response(blob,{headers}));installed++;bytes+=blob.size;
  }
  return{installed,bytes,manifestURL};
}

export function formatBytes(n){if(!Number.isFinite(n))return'Unknown';const units=['B','KB','MB','GB'];let i=0,v=n;while(v>=1024&&i<units.length-1){v/=1024;i++}return`${v.toFixed(i>1?2:i?1:0)} ${units[i]}`}
