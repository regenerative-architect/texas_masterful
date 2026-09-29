# Attributions & Licenses

- **Trystero 0.25.3** — Dan Motzenbecker / contributors. MIT-licensed upstream project. This bundle imports scoped Trystero strategy packages at runtime from esm.sh; it does not copy Trystero source code. https://github.com/dmotz/trystero
- **WebLLM 0.2.85** — MLC AI / contributors. Runtime imported on demand; model artifacts have their own applicable licenses. https://github.com/mlc-ai/web-llm
- Texas/federal agency facts and links remain attributed to their originating public agencies in `data/texas-status.json`.
- Systems architecture/concept: Foster + Navi / Planetary Restoration Archive.

Verify external library/data licenses before redistribution or institutional deployment.

## v2.1 WebLLM browser loading note
The app uses WebLLM 0.2.85 through the documented jsDelivr `esm.run` browser ESM endpoint and the package's Web Worker engine/handler APIs. The external runtime/model remains an online dependency until cached by WebLLM/browser mechanisms.


## v2.6 public inference
Cloudflare Workers AI and OpenRouter are optional external services. This bundle contains integration code only and no provider credentials. Provider terms, quotas and model licenses apply independently.
