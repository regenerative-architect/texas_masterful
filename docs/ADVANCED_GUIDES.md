# Simplified Advanced Guides

## Systems-of-systems design

**One minute:** A project is rarely only a water, housing or energy project. Start with the outcome, then map dependencies across all ten domains.

### Steps
1. Name the outcome and affected population.
2. Select the domains that can block success.
3. Record one measurable dependency per selected domain.
4. Assign owners and evidence.
5. Review the dependency map before major decisions.

**Advanced:** Use causal-loop thinking: identify reinforcing and balancing feedbacks, bottlenecks, lagging indicators and failure cascades. Keep observations separate from hypotheses.

**Expert:** Represent projects as typed nodes with dependency edges, evidence provenance, revision timestamps and explicit assumptions. Avoid centralizing protected or unnecessary personal data.

## Trystero / WebRTC collaboration

**One minute:** Trystero helps browsers discover peers; after connection, project data travels browser-to-browser over WebRTC.

### Steps
1. Choose a non-sensitive room ID.
2. Use a shared password for private working groups.
3. Start with Nostr discovery; try MQTT/Torrent/IPFS only when there is a reason.
4. Connect two devices and exchange a harmless test message.
5. Configure TURN only if direct connectivity repeatedly fails.

**Advanced:** The build uses Trystero 0.25.3 action objects, presence hooks, snapshot requests and room-scoped event exchange. Discovery still requires network infrastructure even though app traffic is peer-to-peer.

**Expert:** For controlled environments, replace public discovery with the Trystero WebSocket-relay strategy and your own relay. Evaluate NAT behavior, TURN cost, browser limits, logging policy and data-retention requirements.

## PWA & offline architecture

**One minute:** The app shell and locally created records can work offline after a hosted first load; live agencies, multiplayer discovery and uncached AI models cannot.

### Steps
1. Serve the folder over HTTPS or localhost.
2. Install the PWA after the first complete load.
3. Export a JSON backup before major browser/device changes.
4. Check the freshness badge before relying on time-sensitive links.

**Advanced:** The service worker uses versioned same-origin app-shell caching and network-first navigation with offline fallback. IndexedDB stores structured local records; localStorage stores small preferences.

**Expert:** Do not use service-worker claims under file://. Treat cross-origin CDN libraries and model artifacts as online dependencies unless explicitly cached by their own mechanisms.

## Local WebLLM assistant

**One minute:** WebLLM can run an LLM locally in a compatible browser using WebGPU, keeping prompts on-device after the library/model is loaded.

### Steps
1. Confirm WebGPU support.
2. Open Local AI Lab.
3. Load the default low-resource model.
4. Use it for drafting or organizing—not authoritative live facts.
5. Verify outputs against the evidence library.

**Advanced:** The assistant runs in a dedicated module worker and uses WebLLM 0.2.85. Model artifacts can be hundreds of MB or more; first load is online and device-dependent.

**Expert:** Pin runtime versions, expose model IDs, treat model cache and prompt history as local data, and build source-grounding or retrieval separately if authoritative citations are required.

## Evidence & provenance

**One minute:** Every important claim should be traceable to a source, date, jurisdiction and limitation.

### Steps
1. Record the source URL and retrieval date.
2. Label facts, estimates, scenarios and hypotheses separately.
3. Prefer official/primary sources for program status and public data.
4. Mark stale or locally unverified information.
5. Attach evidence to the decision it informed.

**Advanced:** Use an append-only evidence log with revisions, content hashes and structured claim/source relationships. A hash detects change; it does not prove who authored the content.

**Expert:** For stronger provenance, combine hashes with signatures, trusted timestamps and source-side identifiers. Preserve source licenses and do not imply a cryptographic hash establishes truth.

## Mapping challenges

**One minute:** Maps are models. Coverage, hazard, service and project layers can be useful without being perfectly current or precise.

### Steps
1. Identify the map owner and update date.
2. Check whether a point, parcel, block or area is the actual unit.
3. Compare mapped status with observed conditions.
4. Document discrepancies with non-sensitive evidence.
5. Use the official challenge/correction workflow where available.

**Advanced:** Avoid false precision. Distinguish service availability, adoption, measured performance, planned construction and operational status.

**Expert:** For interoperable GIS work, store source CRS, geometry precision, update cadence, confidence, licensing and transformation history.

## Multidisciplinary project design

**One minute:** Effective teams translate each discipline into constraints, evidence and handoffs instead of forcing everyone into one vocabulary.

### Steps
1. Choose a shared outcome.
2. Assign disciplinary roles.
3. Create a dependency board.
4. Record decisions and open questions.
5. Schedule evidence-based review gates.

**Advanced:** Use boundary objects—shared artifacts such as maps, budgets, risk registers and outcome metrics—that each discipline can interpret without erasing domain-specific nuance.

**Expert:** Define interface contracts between modules: inputs, outputs, units, uncertainty, update cadence, owner, escalation path and failure behavior.

## Texas broadband project status

**One minute:** Texas’ BEAD final proposal is approved; use official BDO project files for location- and award-specific status rather than assuming a statewide announcement means service is active.

### Steps
1. Open the official BEAD source.
2. Identify the relevant deployment project or serviceable locations.
3. Separate award, construction and activation status.
4. Record local evidence and dates.
5. Do not promise availability until the provider/project confirms service.

**Advanced:** A broadband project pipeline should distinguish need → challenge/validation → award → engineering → permitting → construction → activation → adoption.

**Expert:** Cross-check official project IDs, location fabric versions, challenge outcomes, award amendments and provider reporting before longitudinal analysis.

## Privacy, safety & protected data

**One minute:** The commons is for coordination data, not protected case records or secrets.

### Steps
1. Share the minimum information needed.
2. Keep health, student, policy, credential and identity-sensitive records out of public/P2P rooms.
3. Use pseudonymous project IDs where possible.
4. Do not paste API keys or passwords into shared records.
5. Export and review local data before sharing.

**Advanced:** A P2P architecture changes data paths but does not remove confidentiality obligations. Peers can still receive whatever you choose to send.

**Expert:** Threat-model signaling metadata, peer identity, room-name guessing, browser storage, TURN relays, imported JSON, XSS, link handling and operator access.

## Continuity & recovery

**One minute:** Design for degraded operation before failure occurs.

### Steps
1. Name the critical function.
2. Define its minimum viable service.
3. List dependencies and single points of failure.
4. Create manual/offline alternatives.
5. Set recovery order and evidence capture.

**Advanced:** Use recovery-time and recovery-point objectives where applicable, but translate them into human-readable service goals for public-facing teams.

**Expert:** Model cross-domain common-cause failures and correlated hazards; redundancy is not real if all backups depend on the same upstream system.

## Decision governance

**One minute:** Good collaboration makes it clear who can decide, who must be consulted, and how evidence changes a decision.

### Steps
1. Name the decision owner.
2. List affected parties.
3. Attach evidence and assumptions.
4. Record alternatives and tradeoffs.
5. Set a review trigger/date.

**Advanced:** Separate governance roles from technical roles. A technically strong option may still require legal authority, financing, public process or operational capacity.

**Expert:** Use decision records with status, jurisdiction, authority basis, dissent/uncertainty notes, revision lineage and implementation evidence.