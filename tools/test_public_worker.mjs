import assert from 'assert';
import worker from '../public-inference-worker/src/index.js';
const calls=[];
const env={ALLOWED_ORIGINS:'*',FAST_MODEL:'@cf/zai-org/glm-4.7-flash',HEAVY_MODEL:'@cf/google/gemma-4-26b-a4b-it',ENABLE_OPENROUTER:'0',AI:{run:async(model,payload)=>{calls.push({model,payload});return {response:'worker plan'}}},AI_RATE_LIMITER:{limit:async()=>({success:true})}};
const req=new Request('https://router.example/v1/chat/completions',{method:'POST',headers:{'content-type':'application/json','origin':'https://site.example','x-tx-client':'abc'},body:JSON.stringify({model:'auto',messages:[{role:'user',content:'plan'}],metadata:{task_mode:'comprehensive'},max_tokens:100})});
const res=await worker.fetch(req,env);assert.equal(res.status,200);const j=await res.json();assert.equal(j.choices[0].message.content,'worker plan');assert.equal(calls[0].model,'@cf/google/gemma-4-26b-a4b-it');assert.equal(res.headers.get('x-tx-provider'),'cloudflare-workers-ai');
const h=await worker.fetch(new Request('https://router.example/health',{headers:{origin:'https://site.example'}}),env);assert.equal(h.status,200);const hj=await h.json();assert.equal(hj.ok,true);
console.log('PASS v2.6 Cloudflare Worker routing');
