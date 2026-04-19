---
'@cloudflare/sandbox': patch
---

Export all error classes from `@cloudflare/sandbox` for `instanceof` error handling.
Previously only backup, desktop, and process readiness errors were exported.
Now exports all error classes (e.g. `SessionAlreadyExistsError`, `FileNotFoundError`,
`ProcessNotFoundError`), the `SandboxError` base class, `ErrorCode`/`Operation` constants,
`createErrorFromResponse`, and all error context types.
