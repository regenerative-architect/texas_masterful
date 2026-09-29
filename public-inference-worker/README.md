# Texas Public Intelligence Router — Cloudflare Worker

This Worker gives the static GitHub Pages/PWA build a server-side inference gateway without embedding provider credentials in browser JavaScript.

## Default provider chain

1. Cloudflare Workers AI — fast/general: `@cf/zai-org/glm-4.7-flash`
2. Cloudflare Workers AI — comprehensive/expert: `@cf/google/gemma-4-26b-a4b-it`
3. Automatic retry from the heavy model to the fast model if the heavy request fails.
4. Optional OpenRouter Free fallback if you explicitly enable it and add an API key as a Worker secret.

Cloudflare account quotas and current model availability still apply. On the Workers Free plan, once the free Workers AI allocation is exhausted, additional AI operations fail rather than silently becoming an unlimited free service.

## Easiest Windows deployment

Double-click `DEPLOY_PUBLIC_AI.bat`.

You need Node.js installed. The script runs `npx wrangler login` and `npx wrangler deploy`. After deployment, copy the `https://...workers.dev` URL into **Texas OS → AI Lab → Public intelligence router** and press **Test public gateway**.

## Manual deployment

```bash
cd public-inference-worker
npx wrangler login
npx wrangler deploy
```

## Restrict the caller origin (recommended after initial test)

`wrangler.jsonc` deliberately starts with `ALLOWED_ORIGINS: "*"` so first deployment works without editing. Once the endpoint is confirmed, replace `*` with your exact GitHub Pages origin, for example:

```json
"ALLOWED_ORIGINS": "https://regenerative-architect.github.io,http://127.0.0.1:8765"
```

Then deploy again.

## Built-in safeguards

- Cloudflare Workers AI binding: no Cloudflare API token is sent to the browser.
- 12 chat requests/minute per browser-generated client ID using the Cloudflare Rate Limiting binding.
- 64 KiB request-body cap.
- 2,048-token output cap.
- CORS origin allowlist support.
- Only the configured fast/heavy Workers AI model IDs can be selected by the browser.
- If Cloudflare is unavailable/quota-limited, the PWA still falls back to local WebLLM, localhost AI, and deterministic Meta-Chain execution.

The client ID is a lightweight abuse-control key, not authentication; users can reset or spoof it. For a large public deployment, add Cloudflare Access, Turnstile, or account/session authentication before relying on the endpoint as a costly public service.

## Optional OpenRouter Free fallback

OpenRouter requires an API key even for free-routed API use. Keep it only in the Worker secret store:

```bash
npx wrangler secret put OPENROUTER_API_KEY
```

Then change this in `wrangler.jsonc`:

```json
"ENABLE_OPENROUTER": "1"
```

and redeploy:

```bash
npx wrangler deploy
```

The default OpenRouter model is `openrouter/free`. OpenRouter's free-tier availability/rate limits can change independently of this application.
