# Same-Origin 360M WebLLM Pack

The repository includes `.github/workflows/pages-resilient-ai.yml`. It can build the lightweight SmolLM2 360M model into the GitHub Pages deployment artifact without adding model binaries to normal Git history.

## GitHub UI method

1. Upload/push the v2.6.0 bundle to the repository.
2. Open the repository on GitHub.
3. Open **Actions**.
4. Choose **Deploy Texas OS + Optional Same-Origin AI Pack**.
5. Choose **Run workflow**.
6. Set **Optional same-origin browser model pack** to `fallback-360m`.
7. Run the workflow.
8. After Pages deploys, open the Texas OS, go to **AI Lab**, select `SmolLM2-360M-Instruct-q4f32_1-MLC`, and press **Install hosted offline pack**.
9. The PWA copies the same-origin files into the dedicated AI cache under the original WebLLM artifact URLs. Subsequent WebLLM use can therefore be served from the local PWA cache.

## What the workflow does

- Vendors the WebLLM runtime.
- Runs `python tools/download_model_pack.py SmolLM2-360M-Instruct-q4f32_1-MLC`.
- Places the pack under `models/SmolLM2-360M-Instruct-q4f32_1-MLC/` in the Pages artifact.
- Uploads/deploys that artifact through GitHub Pages.

This increases the published Pages artifact size and bandwidth used by first-time visitors, but keeps large binary weights out of ordinary Git history.
