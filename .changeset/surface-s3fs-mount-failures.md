---
'@cloudflare/sandbox': patch
---

Fix `mountBucket()` silently succeeding when `s3fs` daemonises before its bucket
auth check completes. The method now polls `mountpoint` after running `s3fs` and
throws `S3FSMountError` if the FUSE filesystem never attaches (for example when
the bucket name is wrong or credentials are rejected). Failed mounts also clean
up the temporary mount directory the SDK created.

The error message includes the tail of the `s3fs` log so credential, bucket, and
network failures are diagnosable from the API response instead of returning an
empty `{ ok: true }`.
