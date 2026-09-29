#!/usr/bin/env python3
"""Serve Texas Master Systems OS on localhost and proxy /local-ai/v1 to a local OpenAI-compatible runtime.

Default upstream: http://127.0.0.1:1234/v1 (LM Studio default OpenAI-compatible server URL).
This server binds to 127.0.0.1 by default and does not expose the app to the LAN.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from pathlib import Path
import argparse, os, urllib.parse

class Handler(SimpleHTTPRequestHandler):
    upstream = 'http://127.0.0.1:1234/v1'

    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy','same-origin')
        super().end_headers()

    def _proxy(self):
        suffix=self.path[len('/local-ai/v1'):]
        target=self.upstream.rstrip('/')+suffix
        length=int(self.headers.get('Content-Length') or 0)
        body=self.rfile.read(length) if length else None
        headers={'Content-Type':self.headers.get('Content-Type','application/json')}
        auth=self.headers.get('Authorization')
        if auth: headers['Authorization']=auth
        req=Request(target,data=body,headers=headers,method=self.command)
        try:
            with urlopen(req,timeout=600) as r:
                payload=r.read();self.send_response(r.status)
                self.send_header('Content-Type',r.headers.get('Content-Type','application/json'))
                self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload)
        except HTTPError as e:
            payload=e.read();self.send_response(e.code);self.send_header('Content-Type',e.headers.get('Content-Type','application/json'));self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload)
        except Exception as e:
            payload=(f'{{"error":"local upstream unavailable: {str(e).replace(chr(34), chr(39))}"}}').encode()
            self.send_response(502);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload)

    def do_OPTIONS(self):
        if self.path.startswith('/local-ai/v1'):
            self.send_response(204);self.end_headers();return
        super().do_OPTIONS()
    def do_GET(self):
        if self.path.startswith('/local-ai/v1'): return self._proxy()
        return super().do_GET()
    def do_POST(self):
        if self.path.startswith('/local-ai/v1'): return self._proxy()
        self.send_error(405)

if __name__=='__main__':
    ap=argparse.ArgumentParser(description='Serve the PWA locally and proxy a localhost LLM runtime.')
    ap.add_argument('--port',type=int,default=8765)
    ap.add_argument('--bind',default='127.0.0.1')
    ap.add_argument('--upstream',default='http://127.0.0.1:1234/v1')
    a=ap.parse_args()
    root=Path(__file__).resolve().parents[1];os.chdir(root);Handler.upstream=a.upstream
    print(f'Texas Master Systems OS: http://{a.bind}:{a.port}/')
    print(f'Local AI proxy: http://{a.bind}:{a.port}/local-ai/v1 -> {a.upstream}')
    print('Keep --bind at 127.0.0.1 unless you deliberately intend network exposure.')
    ThreadingHTTPServer((a.bind,a.port),Handler).serve_forever()
