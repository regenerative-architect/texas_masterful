# WebLLM Adaptive Planning — v2.3.1

The AI Lab now distinguishes **hardware compatibility** from **task quality**. The lightest compatible model remains the safe startup default, but a complex planning task may need a larger model.

## Routing

1. Classify the request as Fast, Comprehensive, or Expert implementation.
2. Identify relevant Texas Master Systems domains.
3. Rank compatible models using declared model size/VRAM, instruction tuning, cache availability and task depth.
4. If enabled, switch to a stronger **already cached** model. No surprise multi-hundred-MB download is triggered during generation.
5. Build a deterministic planning scaffold.
6. Ask the model to expand that scaffold while separating facts, assumptions and verification needs.
7. Detect generic refusals or undersized responses and retry once with a corrective instruction.
8. If the response is still weak, return the deterministic plan instead of a non-answer.

## Planning thresholds

The app heuristically prefers roughly >=1B parameters for comprehensive synthesis and >=2B for expert implementation work when hardware permits. It does not claim these are formal quality benchmarks.

## Safety and evidence

The system prompt tells the local model to make assumptions explicit and create verification tasks rather than invent current laws, prices, program statuses or site-specific facts. Agencies and stakeholders are treated as collaborators and evidence sources, not as a reason to refuse ordinary drafting/planning work.
