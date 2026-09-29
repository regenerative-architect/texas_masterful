#!/usr/bin/env python3
from pathlib import Path
from urllib.request import Request,urlopen
URLS=[
 'https://unpkg.com/@mlc-ai/web-llm@0.2.85/lib/index.js',
 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/lib/index.js',
]
out=Path(__file__).resolve().parents[1]/'vendor'/'webllm-0.2.85.mjs';out.parent.mkdir(parents=True,exist_ok=True)
last=None
for url in URLS:
 try:
  print('Downloading',url)
  with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=90) as r: data=r.read()
  out.write_bytes(data);print('Wrote',out,len(data),'bytes');break
 except Exception as e:last=e;print('Failed:',e)
else: raise SystemExit(f'All runtime mirrors failed: {last}')
