# Optional same-origin model packs

The app can stage WebLLM model artifacts into its service-worker cache, or import an offline model-pack folder from the AI Lab. This directory is intentionally empty in the base ZIP because model weights are hundreds of megabytes to multiple gigabytes.

For the default compatible fallback model, run `python tools/download_default_model_pack.py`. Then either deploy the generated pack with your site or choose the generated folder from **AI Resilience & Offline Model Packs**.


## v2.5.0 supported browser packs

Use the generic installer instead of committing weights:

```bash
python tools/download_model_pack.py SmolLM2-360M-Instruct-q4f32_1-MLC
python tools/download_model_pack.py Llama-3.2-1B-Instruct-q4f32_1-MLC
python tools/download_model_pack.py Llama-3.2-3B-Instruct-q4f32_1-MLC
```

The 1B model is the standard planning target; 3B is the advanced browser-synthesis target; 360M remains the recovery model.
