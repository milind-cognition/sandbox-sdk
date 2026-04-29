---
'@cloudflare/sandbox': patch
---

Surface s3fs mount failures from `mountBucket()`. The s3fs process forks and the parent can exit 0 before the FUSE mount is established, so `mountBucket()` now polls `mountpoint -q` to confirm the filesystem appeared. On failure, the s3fs log is included in the thrown `S3FSMountError`.
