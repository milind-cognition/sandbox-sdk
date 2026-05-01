---
'@cloudflare/sandbox': patch
---

Surface s3fs mount failures from `mountBucket()`. Previously, `mountBucket()` returned success even when the underlying s3fs FUSE mount silently failed (e.g., wrong bucket name, 403 AccessDenied). Now the SDK verifies the mount is established after s3fs returns and throws `S3FSMountError` with s3fs log diagnostics on failure.
