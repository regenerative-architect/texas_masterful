# Privacy & Security

- Local records stay in the browser unless the user exports them or explicitly shares a record/message to a peer room.
- Do not place protected health information, student education records, claim/policy identifiers, credentials, home addresses, private keys or other sensitive case data into peer rooms.
- Shared room passwords reduce casual access but do not replace a full organizational identity/access-control program.
- Room IDs may be visible through discovery infrastructure; keep them non-sensitive.
- WebRTC may use TURN when direct connectivity is unavailable; TURN operators can observe network metadata and relay encrypted traffic, though Trystero protects session data in transit.
- Imported JSON should be treated as untrusted input. This reference app renders imported fields as text, not executable markup.
- No telemetry is included.
- No API keys are required or embedded.
- PWA/service-worker support requires HTTPS or localhost; do not imply otherwise under `file://`.


## Record ingestion controls

Peer and backup records pass through a field whitelist with string-length limits. User-supplied evidence URLs are accepted only when they use HTTP(S). Backup imports are capped at 5 MB. Rendering escapes untrusted text rather than inserting it as HTML. TURN credentials are session-only form values and are not saved into the application data model.

## Multiplayer boundary

Trystero room passwords protect signaling-session material from the discovery medium when peers share the same secret, but room participants still receive anything explicitly shared to them. This application does not convert WebRTC into an authorization, compliance or protected-record system.
