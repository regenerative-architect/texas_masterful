# WebLLM Direct Engine Experiment

This branch uses `CreateMLCEngine` as the primary engine factory. The worker engine is retained for A/B testing. Both use WebLLM 0.2.85 and the prebuilt model registry.

Use **Test model hosts** before retrying a model if the UI reports a network failure. A failed host probe identifies a network route that changing engine architecture cannot solve.
