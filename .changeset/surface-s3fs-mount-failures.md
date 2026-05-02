---
'@cloudflare/sandbox': patch
---

Detect and surface s3fs mount failures from `mountBucket()`. The s3fs daemon forks before completing its bucket check, so a successful exit code does not guarantee the mount is live. `mountBucket()` now polls `mountpoint -q` to verify the FUSE filesystem appears, and throws `S3FSMountError` with the s3fs log output when verification fails. Failed mounts also clean up the mount directory to avoid leaving stale empty dirs.
