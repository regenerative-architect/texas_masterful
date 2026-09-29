# Multiplayer Architecture — v2.2.1

## Primary path

- **Trystero 0.25.3**
- Nostr discovery by default
- Selectable MQTT, BitTorrent and IPFS discovery strategies
- Direct browser-to-browser WebRTC application traffic
- Trystero 0.25.x object action API (`send`, `onMessage`, request/response actions)
- Shared room password supported for stronger session-description encryption
- Optional user-supplied TURN as explicit fallback

## Public Commons

Default room: `texas-systems-public-commons-v2`. Auto-connect is enabled by default after the user enters the workspace (or immediately when the splash is skipped). It exchanges presence and snapshot requests. Peer IDs and role labels are **not verified identities**.

## State synchronization

`state-snapshot` is a Trystero request action. On peer join, each peer may request a bounded snapshot from the other. Snapshot records are field-whitelisted, length-limited and merged using revision number followed by timestamp. This is eventual peer state, not a consensus algorithm.

Seven local record stores can sync: projects, tasks, comments, evidence, decisions, questions and handoffs.

## BroadcastChannel fallback

Same-origin tabs/windows use `BroadcastChannel` without Trystero or network access. Browser origin rules still apply.

## TURN

TURN is not hidden infrastructure. Some NAT/firewall combinations cannot establish a direct WebRTC path. In those cases a TURN relay may be required. TURN credentials entered in the UI are intentionally not persisted.

## Legacy adapter

`legacy-server/` contains a small optional WebSocket relay. It is not required by the app and is not a substitute for TURN.
