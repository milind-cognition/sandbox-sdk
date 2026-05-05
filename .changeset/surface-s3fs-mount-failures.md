---
'@cloudflare/sandbox': patch
---

Surface s3fs mount failures from `Sandbox.mountBucket()`. Previously the SDK
returned success whenever the s3fs parent process exited cleanly, even when
the forked daemon then failed its bucket / SigV4 check (e.g. wrong bucket
name, `403 AccessDenied`, or network errors). The first visible signal of a
broken mount was an unrelated `fusermount: entry not found in /etc/mtab`
error at unmount time.

`mountBucket()` now polls `mountpoint(1)` after invoking s3fs to verify the
FUSE filesystem actually attached, captures s3fs daemon output via
`-o logfile=…`, and includes the captured log in the thrown
`S3FSMountError` so failures are diagnosable from the API response. Failed
mounts also clean up the password file and the mount-point directory they
created, so retries start from a clean state.
