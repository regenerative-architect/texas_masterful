# Resilient WebLLM / PWA model delivery

## What the service worker can and cannot do

The PWA service worker can cache model/runtime files after they are successfully fetched and serve those cached responses on later loads. It also supports file-by-file pre-staging with retry, which is more recoverable than treating a complete model initialization as one opaque download. It cannot bypass a GPU feature that the browser does not expose, and it cannot magically fetch a host that is blocked before any copy exists.

## Fallback chain

1. Same-origin vendored WebLLM runtime (`vendor/webllm-0.2.85.mjs`) if present.
2. esm.run or jsDelivr runtime fallback.
3. PWA-staged model assets served from `tx-ai-assets-v1`.
4. Normal WebLLM Cache API / IndexedDB / OPFS model cache.
5. Offline model-pack folder import when remote hosts are unavailable.
6. Optional OpenAI-compatible local inference endpoint.
7. Deterministic planner requiring no model or network.

## Default offline pack

The helper scripts target `SmolLM2-360M-Instruct-q4f32_1-MLC`, which avoids a declared `shader-f16` requirement and has about 579.61 MB declared VRAM in WebLLM 0.2.85. Its MLC model repository itself is roughly 207 MB plus the compiled WebGPU library.

## Security / privacy

Imported pack files remain in browser cache storage for the current origin. Endpoint API keys are not persisted by the application. Only install model/runtime files you trust.

## GitHub Pages self-hosted deployment

The optional `.github/workflows/pages-resilient-ai.yml` workflow vendors the WebLLM runtime into the Pages artifact. When manually dispatched with `include_default_model_pack=true`, it also downloads the default SmolLM2-360M q4f32 pack during the build so users can press **Install hosted offline pack** in the AI Lab and copy those same-origin files into the PWA AI cache. The model binaries are generated during deployment rather than committed to git.
