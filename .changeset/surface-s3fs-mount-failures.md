---
'@cloudflare/sandbox': patch
---

Surface s3fs mount failures from `mountBucket`. The previous implementation
returned success as soon as the daemonising s3fs parent exited, even when
the FUSE child later failed its bucket check (auth error, wrong bucket name,
network failure) and detached the mountpoint. `mountBucket` now waits for
the kernel to publish the FUSE filesystem before returning, captures the
s3fs log so the thrown `S3FSMountError` includes the underlying reason
(`403 AccessDenied`, etc.), and rolls back the mount-point directory and
password file if verification fails.
