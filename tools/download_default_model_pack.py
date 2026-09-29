#!/usr/bin/env python3
import json,sys
from pathlib import Path
from urllib.request import Request,urlopen
MODEL='SmolLM2-360M-Instruct-q4f32_1-MLC'
BASE=f'https://huggingface.co/mlc-ai/{MODEL}/resolve/main/'
LIB='https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/SmolLM2-360M-Instruct-q4f32_1_cs1k-webgpu.wasm'
root=Path(__file__).resolve().parents[1]/'models'/MODEL;root.mkdir(parents=True,exist_ok=True)
def get(url,path):
 if path.exists() and path.stat().st_size: print('Exists',path.name);return
 print('Downloading',url)
 req=Request(url,headers={'User-Agent':'Mozilla/5.0'})
 with urlopen(req,timeout=180) as r,open(path,'wb') as f:
  total=int(r.headers.get('content-length') or 0);done=0
  while True:
   b=r.read(1024*1024)
   if not b:break
   f.write(b);done+=len(b)
   if total: print(f'  {done*100/total:5.1f}%',end='\r')
 print('  done',path.name,path.stat().st_size,'bytes')
get(BASE+'mlc-chat-config.json',root/'mlc-chat-config.json')
get(BASE+'ndarray-cache.json',root/'ndarray-cache.json')
cfg=json.loads((root/'mlc-chat-config.json').read_text())
nd=json.loads((root/'ndarray-cache.json').read_text())
files=list(cfg.get('tokenizer_files',[]))+sorted({x['dataPath'] for x in nd.get('records',[]) if x.get('dataPath')})
for name in files:get(BASE+name,root/name)
get(LIB,root/'model_lib.wasm')
manifest={'model_id':MODEL,'model':f'https://huggingface.co/mlc-ai/{MODEL}','model_lib':LIB,'files':['mlc-chat-config.json','ndarray-cache.json',*files,'model_lib.wasm']}
(root/'pack.json').write_text(json.dumps(manifest,indent=2))
print('\nModel pack ready:',root)
print('Select this folder in the AI Lab offline model-pack importer, or host its files with the site.')
