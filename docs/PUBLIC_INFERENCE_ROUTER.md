# Public Intelligence Router

Texas Master Systems OS v2.6.0 adds an opportunistic hosted-inference layer without making hosted inference a hard dependency.

## Execution hierarchy

For comprehensive/expert tasks when the public gateway is configured:

1. Explicit localhost 8B+ runtime, when selected/preferred and available.
2. Public Cloudflare Worker gateway for hosted synthesis.
3. Compatible browser-local WebLLM model (360M / 1B / 3B).
4. Other explicitly configured OpenAI-compatible endpoint.
5. Deterministic Meta-Chain planning scaffold.

For ordinary tasks, browser-local inference remains preferred before public compute unless the user changes routing.

## Why a Worker

The static GitHub Pages app cannot safely contain Cloudflare/OpenRouter credentials. A Worker holds the provider-side configuration and exposes only a constrained chat endpoint to the browser.

The default Worker calls Workers AI through `env.AI`, chooses GLM-4.7-Flash for ordinary stages and Gemma 4 26B A4B for comprehensive/expert stages, and retries the fast model when the heavy model fails. Optional OpenRouter Free routing is server-side only.

## Failure behavior

Public inference is deliberately non-critical. HTTP errors, quota exhaustion, capacity errors, CORS rejection or an undeployed gateway cause the application to continue down its local/deterministic fallback chain.
