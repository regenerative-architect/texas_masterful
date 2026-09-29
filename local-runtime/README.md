# Local companion launcher

This is the most robust path for a large local model when the public GitHub Pages origin has trouble reaching a localhost inference server.

1. Start your OpenAI-compatible model server. With LM Studio, the documented default example is `http://localhost:1234/v1`.
2. From the bundle root, run:

```bash
python local-runtime/serve_local.py
```

3. Open `http://127.0.0.1:8765/` in the browser.
4. In Local AI Lab choose **Same-origin companion**. The app will use `/local-ai/v1` on the same origin; the Python launcher proxies that request to `127.0.0.1:1234/v1`.

The companion binds only to `127.0.0.1` by default. Do not bind it to `0.0.0.0` unless you understand the network/security implications.
