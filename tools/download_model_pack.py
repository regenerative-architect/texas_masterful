#!/usr/bin/env python3
"""Download a supported WebLLM model pack without committing weights to git."""
import json,sys,argparse
from pathlib import Path
from urllib.request import Request,urlopen
MODELS={
 'SmolLM2-360M-Instruct-q4f32_1-MLC':'SmolLM2-360M-Instruct-q4f32_1_cs1k-webgpu.wasm',
 'Llama-3.2-1B-Instruct-q4f32_1-MLC':'Llama-3.2-1B-Instruct-q4f32_1_cs1k-webgpu.wasm',
 'Llama-3.2-3B-Instruct-q4f32_1-MLC':'Llama-3.2-3B-Instruct-q4f32_1_cs1k-webgpu.wasm',
}
LIB_PREFIX='https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/'
def get(url,path):
 path.parent.mkdir(parents=True,exist_ok=True)
 if path.exists() and path.stat().st_size: print('Exists',path.name); return
 print('Downloading',url)
 req=Request(url,headers={'User-Agent':'Mozilla/5.0'})
 with urlopen(req,timeout=240) as r,open(path,'wb') as f:
  total=int(r.headers.get('content-length') or 0);done=0
  while True:
   b=r.read(1024*1024)
   if not b:break
   f.write(b);done+=len(b)
   if total:print(f'  {done*100/total:5.1f}%',end='\r')
 print('  done',path.name,path.stat().st_size,'bytes')
def main():
 ap=argparse.ArgumentParser();ap.add_argument('model',choices=MODELS);ap.add_argument('--out',default=None);a=ap.parse_args()
 model=a.model;base=f'https://huggingface.co/mlc-ai/{model}/resolve/main/';root=Path(a.out) if a.out else Path(__file__).resolve().parents[1]/'models'/model
 root.mkdir(parents=True,exist_ok=True); get(base+'mlc-chat-config.json',root/'mlc-chat-config.json');get(base+'ndarray-cache.json',root/'ndarray-cache.json')
 cfg=json.loads((root/'mlc-chat-config.json').read_text());nd=json.loads((root/'ndarray-cache.json').read_text());files=list(cfg.get('tokenizer_files',[]))+sorted({x['dataPath'] for x in nd.get('records',[]) if x.get('dataPath')})
 for name in files:get(base+name,root/name)
 lib=LIB_PREFIX+MODELS[model];get(lib,root/'model_lib.wasm')
 manifest={'schema':'tx-webllm-model-pack','version':1,'model_id':model,'model':f'https://huggingface.co/mlc-ai/{model}','model_lib':lib,'files':['mlc-chat-config.json','ndarray-cache.json',*files,'model_lib.wasm']};(root/'pack.json').write_text(json.dumps(manifest,indent=2))
 print('\nModel pack ready:',root)
if __name__=='__main__':main()
