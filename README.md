# Texas Master Systems OS v2.6.0 — Public Intelligence Router

A local-first, multiplayer, ten-domain Texas planning PWA with Meta-Chain orchestration, resilient WebLLM, optional localhost inference and an opportunistic public hosted-inference gateway.

## v2.6.0 additions

- `public-inference.js` adds a Public Intelligence Router to the AI Lab.
- Comprehensive/expert planning and Meta-Chain stages can use a user-deployed Cloudflare Worker for hosted synthesis.
- Default Workers AI routing uses GLM-4.7-Flash for ordinary work and Gemma 4 26B A4B for comprehensive/expert work, with heavy → fast retry.
- The Worker uses the Workers AI binding, so provider credentials are not embedded in GitHub Pages.
- Cloudflare Rate Limiting binding, request/output caps and CORS allowlisting are included.
- Optional OpenRouter Free fallback can be enabled server-side with a Worker secret.
- Hosted inference is never required: local WebLLM, localhost inference and deterministic Meta-Chain remain available.
- Existing 360M / 1B / 3B browser tiers, same-origin model-pack deployment workflow, PWA cache staging, model-folder import, Meta-Chain Studio, Nexus, Cascade Lab, Evidence, Project Commons, quests and Trystero/WebRTC are retained.
- The responsive percentage/viewport splash and independent 7.2-second fail-safe remain intact.

## Deploy public inference

Open `public-inference-worker/`. On Windows, double-click `DEPLOY_PUBLIC_AI.bat`, or manually run:

```bash
npx wrangler login
npx wrangler deploy
```

Copy the resulting `https://...workers.dev` URL into **AI Lab → Public intelligence router → Worker gateway URL**, then press **Test public gateway**.

After initial validation, restrict `ALLOWED_ORIGINS` in `public-inference-worker/wrangler.jsonc` to your GitHub Pages origin and redeploy.

See `docs/PUBLIC_INFERENCE_ROUTER.md` and `public-inference-worker/README.md`.

## Same-origin 360M model

The included GitHub Pages workflow already supports a same-origin pack without committing weights to Git history. Run **Actions → Deploy Texas OS + Optional Same-Origin AI Pack → Run workflow**, choose `fallback-360m`, and deploy. The workflow downloads the SmolLM2 360M model into the Pages build artifact. In the AI Lab, select that model and choose **Install hosted offline pack** to seed the PWA AI cache from your own Pages origin. See `docs/SAME_ORIGIN_360M.md`.

## Boundaries

A PWA/service worker improves availability after assets are obtained but cannot create missing WebGPU features or bypass an unreachable origin. Public inference can be quota-limited or temporarily unavailable. The deterministic Meta-Chain layer is retained specifically so the core planning system continues to function when all model paths fail.
