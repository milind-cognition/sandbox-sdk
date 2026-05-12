---
'@cloudflare/sandbox': patch
---

Preserve the original `Content-Length` header on HEAD responses when outbound HTTP traffic interception is enabled. Previously, proxied HEAD requests returned `Content-Length: 0`, which broke tools that rely on accurate content length (e.g. s3fs file size reporting).
