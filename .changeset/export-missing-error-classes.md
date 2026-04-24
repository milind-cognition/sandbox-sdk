---
'@cloudflare/sandbox': patch
---

Export `SessionAlreadyExistsError`, `SessionDestroyedError`, `ProcessNotFoundError`, and `SandboxError` error classes from the package entrypoint, enabling consumers to use `instanceof` checks for precise error handling.
