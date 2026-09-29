# Optional same-origin WebLLM runtime

Place `webllm-0.2.85.mjs` in this directory to eliminate the browser's WebLLM CDN dependency. The app tries this same-origin file first, then falls back to esm.run and jsDelivr.

Use `python tools/vendor_webllm.py` on a machine that can reach unpkg/jsDelivr.
