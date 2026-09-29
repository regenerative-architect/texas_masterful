# Deployment

For PWA/service-worker behavior serve the entire folder over HTTPS or localhost.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

`file://` supports much of the reading/calculator/local-data shell, but service workers do not run there and module-worker/CDN behavior may be restricted.

### Production checks

1. Verify the service-worker cache version and HTTPS.
2. Test Trystero Nostr and at least one alternate strategy on two real networks.
3. Test direct WebRTC and a controlled TURN fallback.
4. Test WebLLM on representative WebGPU devices; do not assume every device can load the model.
5. Review Public Commons auto-connect and organizational privacy requirements.
6. Validate official-status freshness before public decisions.
