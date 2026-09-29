/* Texas Master Systems OS v2.3.1 — WebLLM dedicated worker with local-runtime-first fallback. */
let webllm=null,lastError=null;
for(const url of ['./vendor/webllm-0.2.85.mjs','https://esm.run/@mlc-ai/web-llm@0.2.85','https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm']){
  try{webllm=await import(url);break}catch(e){lastError=e}
}
if(!webllm)throw lastError||new Error('WebLLM runtime unavailable');
const handler=new webllm.WebWorkerMLCEngineHandler();
self.onmessage=msg=>handler.onmessage(msg);
