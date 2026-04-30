---
'@cloudflare/sandbox': patch
---

Detect silent s3fs mount failures in `mountBucket()`. After invoking s3fs, the SDK now verifies the FUSE filesystem appeared via `mountpoint -q` with a retry loop. If the mount never establishes (e.g. wrong bucket name, auth error), `mountBucket()` throws an `S3FSMountError` with the s3fs log output instead of returning false success.
