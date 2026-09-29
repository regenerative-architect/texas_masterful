# WebLLM Hardware Autodetect

The AI Lab performs a browser-local capability assessment using WebGPU adapter availability, required-feature support (including shader-f16), reported WebGPU limits, `navigator.hardwareConcurrency`, `navigator.deviceMemory` when exposed, secure-context status, and origin storage information.

Browsers do not expose reliable total GPU VRAM, so the hardware class and model recommendations are explicitly heuristic. Model compatibility is evaluated separately from each WebLLM registry entry's declared `required_features` and buffer requirements.

The default model is always the compatible model with the lowest declared `vram_required_MB`. The Balanced and Higher-capacity choices are optional candidates within the detector's conservative compute tier.
