# Tiered Local AI Stack — v2.5.0

The app deliberately separates model *delivery* from model *execution*.

## Browser-local tiers

1. **Fallback:** `SmolLM2-360M-Instruct-q4f32_1-MLC` — smallest compatibility model.
2. **Standard:** `Llama-3.2-1B-Instruct-q4f32_1-MLC` — preferred general planning model when hardware permits.
3. **Advanced:** `Llama-3.2-3B-Instruct-q4f32_1-MLC` — stronger comprehensive synthesis when hardware permits.

Do not commit these model weights to normal Git history. Use `tools/download_model_pack.py` or `.ps1`, deploy model packs as release/deployment artifacts when appropriate, or let the PWA stage/download them once and retain them in browser storage.

## Local 8B+ runtime

For genuinely heavier synthesis, keep the PWA as the orchestration UI and run the model in a local inference server. The AI Lab includes an OpenAI-compatible endpoint adapter and an LM Studio preset (`http://localhost:1234/v1`). LM Studio documents `/v1/models` and `/v1/chat/completions` compatibility endpoints. If browser requests fail, enable the server's CORS support deliberately and keep it bound to `127.0.0.1` unless LAN access is intended and authenticated.

The app never assumes that a local server is running, never enables remote access automatically, and does not persist endpoint API keys.

## Routing order

Default Auto routing:

1. Cached/loaded compatible browser model.
2. Configured localhost server for comprehensive/expert work when enabled.
3. Explicitly configured remote endpoint only when the user opts in.
4. Deterministic Meta-Chain/system-planning scaffold.

The service worker improves repeatability and offline availability after successful staging; it cannot add missing GPU features or bypass a host that has never been reachable.

## Same-origin local companion

If a hosted HTTPS page cannot reach a localhost server reliably, run `python local-runtime/serve_local.py` and open the PWA at `http://127.0.0.1:8765/`. The launcher proxies `/local-ai/v1` to the local runtime, so the browser sees a same-origin request. Service workers are permitted on localhost. The launcher binds to loopback by default.
