# Optional legacy WebSocket adapter

This directory is **not** the primary multiplayer architecture. The primary path is Trystero 0.25.3 discovery + browser-to-browser WebRTC.

Use this adapter only for migration, controlled-network experiments or environments where a WebSocket event relay is explicitly preferred. It does **not** replace TURN: TURN relays WebRTC media/data when direct peer connectivity fails, while this adapter is an application-level WebSocket relay.

```bash
cd legacy-server
npm install
npm start
```

No client auto-connects to this server.
