---
'@cloudflare/sandbox': patch
---

Export all error classes from the package entrypoint for `instanceof`-based error handling.
Previously only backup, desktop, and process readiness errors were exported. Now all error
classes (e.g. `SessionAlreadyExistsError`, `SessionDestroyedError`, `ProcessNotFoundError`,
`SandboxError`) are available as direct imports from `@cloudflare/sandbox`.
