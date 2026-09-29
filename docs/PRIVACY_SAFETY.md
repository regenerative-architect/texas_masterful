# Privacy, Safety & Data Boundaries

- Do not place medical records, student PII, policy/claim identifiers, credentials, precise home addresses, secrets or regulated case data in public/P2P rooms.
- Peer IDs are transport identifiers, not identity proof. Self-declared roles are not credential verification.
- Public Commons auto-connect can be disabled in Settings. No local record is sent as an event until explicitly shared; peer snapshot sync can still expose any records retained in the shared workspace, so keep protected records out of this app if they must never be peer-shared.
- TURN credentials are kept in memory only.
- JSON imports are schema checked and size limited; peer records are whitelisted and escaped before rendering.
- Hashes establish integrity of bytes, not authorship or truth.

**Zero-Harm / Anti-Inversion:** use the platform to increase safety, access, resilience and cooperation. Do not use collaboration features to bypass lawful safety, privacy, professional, regulatory or public-health controls.
