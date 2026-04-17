---
'@cloudflare/sandbox': patch
---

Fix `localBucket: true` mount sync when prefix starts with `/`. The leading slash is now stripped so R2 list/put operations use correct key format, matching the behavior documented for `mountBucket` and used by the production FUSE path.
