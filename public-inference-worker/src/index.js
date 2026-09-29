const JSON_HEADERS={'content-type':'application/json; charset=utf-8'};
const DEFAULT_FAST='@cf/zai-org/glm-4.7-flash';
const DEFAULT_HEAVY='@cf/google/gemma-4-26b-a4b-it';

function csv(v){return String(v||'').split(',').map(x=>x.trim()).filter(Boolean)}
function allowedOrigin(request,env){const origin=request.headers.get('Origin')||'';const allow=csv(env.ALLOWED_ORIGINS||'*');if(allow.includes('*'))return origin||'*';return allow.includes(origin)?origin:''}
function cors(origin){return {'Access-Control-Allow-Origin':origin||'null','Access-Control-Allow-Headers':'Content-Type, Authorization, x-tx-client, x-tx-task-mode','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Expose-Headers':'x-tx-provider,x-tx-model','Vary':'Origin'}}
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{...JSON_HEADERS,...extra}})}
function contentFrom(result){return result?.response||result?.result?.response||result?.choices?.[0]?.message?.content||result?.output_text||''}
function chooseModel(body,env){const fast=env.FAST_MODEL||DEFAULT_FAST,heavy=env.HEAVY_MODEL||DEFAULT_HEAVY,mode=String(body?.metadata?.task_mode||'').toLowerCase(),req=String(body?.model||'auto');if(req==='fast')return fast;if(req==='heavy')return heavy;if(req!=='auto'&&[fast,heavy].includes(req))return req;return ['comprehensive','expert'].includes(mode)?heavy:fast}
function openAI(body,model,content){return {id:'tx-'+crypto.randomUUID(),object:'chat.completion',created:Math.floor(Date.now()/1000),model,choices:[{index:0,message:{role:'assistant',content},finish_reason:'stop'}]}}
async function cloudflareRun(body,env,model){const payload={messages:(body.messages||[]).slice(-12).map(x=>({role:x.role,content:String(x.content||'').slice(0,24000)})),temperature:Math.max(0,Math.min(1.5,Number(body.temperature??.2))),max_tokens:Math.max(32,Math.min(2048,Number(body.max_tokens||body.max_completion_tokens||1200)))};const r=await env.AI.run(model,payload);const content=contentFrom(r);if(!content)throw new Error('Workers AI returned no text');return openAI(body,model,content)}
async function openRouterRun(body,env){if(!env.OPENROUTER_API_KEY||String(env.ENABLE_OPENROUTER||'0')!=='1')throw new Error('OpenRouter fallback not configured');const model=env.OPENROUTER_MODEL||'openrouter/free';const payload={model,messages:(body.messages||[]).slice(-12),temperature:Math.max(0,Math.min(1.5,Number(body.temperature??.2))),max_tokens:Math.max(32,Math.min(2048,Number(body.max_tokens||1200)))};const r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${env.OPENROUTER_API_KEY}`,'Content-Type':'application/json','HTTP-Referer':env.APP_URL||'https://example.invalid','X-Title':'Texas Master Systems OS'},body:JSON.stringify(payload)});if(!r.ok)throw new Error(`OpenRouter ${r.status}: ${(await r.text()).slice(0,240)}`);const j=await r.json();return j}

export default {
  async fetch(request,env){
    const origin=allowedOrigin(request,env),u=new URL(request.url);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin||'*')});
    if(!origin)return json({error:'Origin not allowed'},403,cors('null'));
    const headers=cors(origin);
    if(u.pathname==='/'||u.pathname==='/health')return json({ok:true,service:'Texas Public Intelligence Router',fast_model:env.FAST_MODEL||DEFAULT_FAST,heavy_model:env.HEAVY_MODEL||DEFAULT_HEAVY,openrouter_enabled:!!(env.OPENROUTER_API_KEY&&String(env.ENABLE_OPENROUTER||'0')==='1'),free_tier_note:'Cloudflare account quotas and model availability apply.'},200,headers);
    if(u.pathname==='/v1/models')return json({object:'list',data:[{id:'auto',object:'model'},{id:'fast',object:'model'},{id:'heavy',object:'model'},{id:env.FAST_MODEL||DEFAULT_FAST,object:'model'},{id:env.HEAVY_MODEL||DEFAULT_HEAVY,object:'model'}]},200,headers);
    if(u.pathname!=='/v1/chat/completions'||request.method!=='POST')return json({error:'Not found'},404,headers);
    const len=Number(request.headers.get('content-length')||0);if(len>65536)return json({error:'Request too large'},413,headers);
    const client=(request.headers.get('x-tx-client')||'anonymous').slice(0,128);
    if(env.AI_RATE_LIMITER){const {success}=await env.AI_RATE_LIMITER.limit({key:'chat:'+client});if(!success)return json({error:'Rate limit exceeded. Try again shortly.'},429,{...headers,'Retry-After':'60'})}
    let body;try{body=await request.json()}catch{return json({error:'Invalid JSON'},400,headers)}
    if(!Array.isArray(body.messages)||!body.messages.length)return json({error:'messages[] required'},400,headers);
    const primary=chooseModel(body,env),fast=env.FAST_MODEL||DEFAULT_FAST;
    const attempts=[primary,...(primary!==fast?[fast]:[])];let last='';
    for(const model of attempts){try{const out=await cloudflareRun(body,env,model);return json(out,200,{...headers,'x-tx-provider':'cloudflare-workers-ai','x-tx-model':model})}catch(e){last=String(e?.message||e)}}
    try{const out=await openRouterRun(body,env);return json(out,200,{...headers,'x-tx-provider':'openrouter-free','x-tx-model':out.model||env.OPENROUTER_MODEL||'openrouter/free'})}catch(e){last += ` | ${String(e?.message||e)}`}
    return json({error:'All hosted inference paths are currently unavailable',detail:last.slice(0,700)},503,headers);
  }
};
