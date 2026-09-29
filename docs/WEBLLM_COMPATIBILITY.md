# WebLLM Compatibility Profile — v2.2.2

The default WebLLM bootstrap path in this release is adapted from the working implementation in the user-supplied `texas_connectivity_opportunity_os_v5_public_commons(1).zip`.

## Proven path carried forward

1. Load `@mlc-ai/web-llm@0.2.85` from `https://esm.run/`.
2. Create a dedicated module worker.
3. In the worker, instantiate `WebWorkerMLCEngineHandler`.
4. Create the engine through `CreateWebWorkerMLCEngine`.
5. Preserve `prebuiltAppConfig.model_list`.
6. Use IndexedDB as the default compatibility cache profile; the legacy `useIndexedDBCache: true` marker is retained alongside the current `cacheBackend: "indexeddb"` setting for compatibility with the known-good path.
7. Use `engine.unload()` to release GPU allocations while leaving persistent model artifacts cached.

The master OS keeps its newer model catalog, compute sorting, storage diagnostics, cache verification, deletion controls, and alternate Cache API/OPFS options. Direct `CreateMLCEngine` loading is fallback-only.

The service worker continues to cache only same-origin app assets; it does not proxy or precache WebLLM runtime/model artifacts.
