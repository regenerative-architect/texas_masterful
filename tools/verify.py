from pathlib import Path
import re,json,subprocess,sys
root=Path(__file__).resolve().parents[1]
required=['index.html','styles.css','app.js','meta-chain.js','ai-tiered-stack.js','public-inference.js','collaboration.js','webllm-worker.js','sw.js','manifest.webmanifest','offline.html','README.md','THIRD_PARTY_NOTICES.md','LICENSE','icons/texas-master.svg','icons/texas-master-192.png','icons/texas-master-512.png','master-manifest.json','data/texas-status.json','data/collaboration-roles.json','data/extra-modules.json','data/advanced-guides-additions.json','docs/MULTIPLAYER.md','docs/PRIVACY_SAFETY.md','docs/DEPLOYMENT.md','legacy-server/server.mjs','legacy-server/package.json']
missing=[x for x in required if not (root/x).exists()]
if missing: raise SystemExit('FAIL missing: '+','.join(missing))
master=json.load(open(root/'master-manifest.json',encoding='utf-8'))
if len(master.get('domains',[]))!=10 or master.get('backupSchemaVersion')!=5: raise SystemExit('FAIL master manifest')
status=json.load(open(root/'data/texas-status.json',encoding='utf-8'))
if len(status.get('records',[]))<12: raise SystemExit('FAIL status records')
html=(root/'index.html').read_text(encoding='utf-8'); ids=re.findall(r'id="([^"]+)"',html)
if len(ids)!=len(set(ids)): raise SystemExit('FAIL duplicate HTML ids')
js=(root/'app.js').read_text(encoding='utf-8')
for route in ['home','nexus','chains','status','projects','coordination','quests','evidence','decisions','scenario','guides','ai','about']:
    if f"id:'{route}'" not in js: raise SystemExit('FAIL missing route '+route)
for store in ['projects','tasks','comments','evidence','decisions','questions','handoffs','quests','chains','chainRuns','chainArtifacts']:
    if f"'{store}'" not in js: raise SystemExit('FAIL missing store '+store)
for marker in ['STATUS_FACTS','ROLE_CATALOG','runDeterministicPlanner','autoJoinPublicRoom','boundedSnapshot','mergeSnapshot','BroadcastChannel']:
    if marker not in js: raise SystemExit('FAIL missing '+marker)
collab=(root/'collaboration.js').read_text(encoding='utf-8')
for marker in ["VERSION='0.25.3'","makeAction('state-snapshot',{kind:'request'","snapshotAction.request","turnConfig","joinRoom(config,roomId,{onJoinError"]:
    if marker not in collab: raise SystemExit('FAIL collaboration marker '+marker)
worker=(root/'webllm-worker.js').read_text(encoding='utf-8')
for marker in ['@mlc-ai/web-llm@0.2.85','WebWorkerMLCEngineHandler']:
    if marker not in worker: raise SystemExit('FAIL WebLLM '+marker)
sw=(root/'sw.js').read_text(encoding='utf-8')
if "tx-master-os-v2.6.0" not in sw: raise SystemExit('FAIL service-worker version')
print('PASS static structure: 10 domains, >=300 runtime modules, 11 stores, status/evidence data, Trystero 0.25.3 snapshot sync, PWA/WebLLM/legacy adapter present')

app = (root / "app.js").read_text(encoding="utf-8")
for marker in ["prebuiltAppConfig", "vram_required_MB", "hasModelInCache", "deleteModelAllInfoInCache", "downloadAIModel", "CreateWebWorkerMLCEngine"]:
    if marker not in app: raise SystemExit(f"FAIL WebLLM model studio marker: {marker}")
print("PASS WebLLM model studio markers")

# v2.2.4 feature-aware WebLLM comparison checks
app=(root/'app.js').read_text(encoding='utf-8')
for marker in ['CreateMLCEngine','CreateWebWorkerMLCEngine','WEBLLM_CDNS','testAIHosts','model-tier-group','direct-worker','hasModelInCache']:
    if marker not in app: raise SystemExit(f'FAIL WebLLM direct comparison marker: {marker}')
print('PASS WebLLM direct-engine comparison, fallback worker, host probes and collapsible catalog markers')

for marker in ['evaluateAIModelCompatibility','shader-f16','aiCompat','bestCompatibleAIModel','gpu-compatibility']:
    if marker not in app: raise SystemExit(f'FAIL feature-aware WebLLM marker: {marker}')
print('PASS feature-aware WebGPU compatibility filtering and diagnostics')

for marker in ['detectAIHardwareAndRecommend','buildAIHardwareProfile','computeAIRecommendations','aiRecommendations','Default · lightest compatible','navigator.hardwareConcurrency','navigator.deviceMemory']:
    if marker not in app: raise SystemExit(f'FAIL hardware autodetect marker: {marker}')
print('PASS WebLLM hardware autodetect, recommendations, and lightest-compatible default markers')

app=(root/'app.js').read_text(encoding='utf-8')
ai=(root/'ai-resilience.js').read_text(encoding='utf-8')
sw=(root/'sw.js').read_text(encoding='utf-8')
for marker in ['stageSelectedAIModel','installHostedAIModelPack','installSelectedAIModelPack','runResilientAI','WEBLLM_BUILTIN_FALLBACK']:
    if marker not in app: raise SystemExit('FAIL resilient AI marker '+marker)
for marker in ['AI_ASSET_CACHE','buildModelAssetPlan','installHostedPack','installLocalFolderPack']:
    if marker not in ai: raise SystemExit('FAIL AI resilience module marker '+marker)
for marker in ['AI_STAGE','tx-ai-assets-v1','huggingface.co']:
    if marker not in sw: raise SystemExit('FAIL AI service-worker marker '+marker)
print('PASS resilient AI/PWA markers')

meta=(root/'meta-chain.js').read_text(encoding='utf-8')
for marker in ['Meta-Chain Orchestrator','edible-infrastructure','empowerment-ai','Autopilot','compileRun','chainArtifacts','chainRuns','customChainForm']:
    if marker not in meta: raise SystemExit('FAIL meta-chain marker '+marker)
if meta.count("{id:'") < 13: raise SystemExit('FAIL bundled meta-chain template count')
for marker in ["window.TXAIChain","state.route===\'chains\'","backupSchemaVersion"]:
    if marker not in (app+json.dumps(master)): raise SystemExit('FAIL meta-chain integration marker '+marker)
print('PASS Meta-Chain Studio: >=13 bundled templates, DAG/checkpoint execution, AI fallback, evidence/P2P records and Project Commons compilation markers')

# v2.5.0 tiered local AI + fail-safe splash
tier=(root/'ai-tiered-stack.js').read_text(encoding='utf-8')
for marker in ['SmolLM2-360M-Instruct-q4f32_1-MLC','Llama-3.2-1B-Instruct-q4f32_1-MLC','Llama-3.2-3B-Instruct-q4f32_1-MLC','http://localhost:1234/v1','Discover local models']:
    if marker not in tier: raise SystemExit('FAIL tiered AI marker '+marker)
html=(root/'index.html').read_text(encoding='utf-8')
for marker in ['window.__txCloseSplash','failsafe-timeout','7200','ai-tiered-stack.js']:
    if marker not in html: raise SystemExit('FAIL splash/module marker '+marker)
styles=(root/'styles.css').read_text(encoding='utf-8')
for marker in ['left:50%;top:52%','width:min(72vw,74vh)','body.splash-closed .splash','v2.6.0 tiered local AI + public inference']:
    if marker not in styles: raise SystemExit('FAIL responsive splash/tier style '+marker)
for rel in ['models/model-pack-index.json','tools/download_model_pack.py','tools/download_model_pack.ps1','docs/TIERED_LOCAL_AI.md']:
    if not (root/rel).exists(): raise SystemExit('FAIL missing v2.5 asset '+rel)
print('PASS v2.5 tiered local AI, model-pack tools, localhost discovery and fail-safe responsive splash markers')

for rel in ['local-runtime/serve_local.py','local-runtime/README.md']:
    if not (root/rel).exists(): raise SystemExit('FAIL missing local runtime companion '+rel)
if 'Same-origin companion' not in (root/'ai-tiered-stack.js').read_text(encoding='utf-8'): raise SystemExit('FAIL companion UI marker')
print('PASS same-origin localhost AI companion markers')

# v2.6 public inference router
pub=(root/'public-inference.js').read_text(encoding='utf-8')
for marker in ['Public intelligence router','TXPublicInference','/v1/chat/completions','preferHeavy','tryBeforeDeterministic']:
    if marker not in pub: raise SystemExit('FAIL public inference client marker '+marker)
for marker in ['TXPublicInference.generate','Public hosted inference','public hosted']:
    if marker not in app: raise SystemExit('FAIL public inference app integration '+marker)
worker=root/'public-inference-worker/src/index.js'
wrangler=root/'public-inference-worker/wrangler.jsonc'
for rel in [worker,wrangler,root/'public-inference-worker/DEPLOY_PUBLIC_AI.bat',root/'docs/PUBLIC_INFERENCE_ROUTER.md',root/'docs/SAME_ORIGIN_360M.md']:
    if not rel.exists(): raise SystemExit('FAIL missing public inference asset '+str(rel.relative_to(root)))
w=worker.read_text(encoding='utf-8')
for marker in ['@cf/zai-org/glm-4.7-flash','@cf/google/gemma-4-26b-a4b-it','AI_RATE_LIMITER','OPENROUTER_API_KEY','All hosted inference paths']:
    if marker not in w: raise SystemExit('FAIL public Worker marker '+marker)
if './public-inference.js' not in sw: raise SystemExit('FAIL public inference service-worker asset')
print('PASS v2.6 public inference router, Worker safety/fallback markers and same-origin 360M documentation')
