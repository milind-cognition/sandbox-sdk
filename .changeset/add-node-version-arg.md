---
'@cloudflare/sandbox': patch
---

Add `NODE_VERSION` build arg to Dockerfile for customizing the Node.js version, matching the existing `BUN_VERSION` pattern. Defaults to `20` (current behavior). Override via `--build-arg NODE_VERSION=22`.
