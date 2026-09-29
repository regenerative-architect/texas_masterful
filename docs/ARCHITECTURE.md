# Architecture

Texas Master Systems OS v2 is a local-first, static-hostable systems-of-systems workspace.

**Shell:** semantic HTML + CSS + vanilla JavaScript.

**Local state:** IndexedDB v3; localStorage only for preferences.

**Portable state:** validated JSON schema v4 (imports v1-v4).

**P2P:** Trystero 0.25.3 discovery + WebRTC; BroadcastChannel same-device fallback; optional TURN; optional legacy WebSocket adapter.

**AI:** WebLLM 0.2.85 in dedicated Web Worker with deterministic no-model fallback.

**PWA:** versioned service worker caches same-origin core and machine-readable data files. External agency sites, discovery relays, CDN libraries and uncached model artifacts remain online dependencies.

**Cross-domain data model:** project → task/comment/question/evidence/decision/handoff. Each record has an ID, revision and update timestamp.
