# Meta-Chain Orchestrator — v2.4.0

Meta-Chain Studio turns a broad objective into a directed execution graph. A stage has an instruction, dependencies, role, complexity, evidence requirement, checkpoint behavior, domains, output type and expected deliverables.

## Execution modes

- **Guided:** execute one ready stage at a time and review outputs.
- **Autopilot:** execute dependency-ready stages until a human checkpoint.
- **Collaborative:** claim/share stages and artifacts over the existing P2P record layer. Peer IDs and role labels remain unverified identities.

## AI behavior

If a resilient WebLLM model is already loaded, chain stages use it through a bounded stage API with refusal/weak-response correction. If no model is loaded or generation fails, the stage produces deterministic implementation scaffolding instead of becoming unusable. Model output is never treated as evidence merely because it was generated.

## Compilation

A run can compile into Project Commons. The compiler creates a project plus relevant tasks, evidence questions, cross-domain handoffs, a decision record and a collaboration quest. Run context can also seed Cross-Domain Nexus and Cascade Lab forms.

## Provenance

Stage artifacts retain run/stage IDs, prompt, owner, execution mode/model, attached evidence references, timestamp and SHA-256 where WebCrypto is available.
