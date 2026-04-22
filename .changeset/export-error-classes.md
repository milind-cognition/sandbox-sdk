---
'@cloudflare/sandbox': patch
---

Export concrete error classes from `@cloudflare/sandbox` so consumers can use `instanceof` checks for exact error handling.

Previously only a small subset of error classes (`Backup*Error`, `Desktop*Error`, `ProcessReadyTimeoutError`, `ProcessExitedBeforeReadyError`, `InvalidBackupConfigError`) were re-exported from the package entrypoint. Classes like `SandboxError`, `SessionAlreadyExistsError`, `SessionDestroyedError`, `ProcessNotFoundError`, `FileNotFoundError`, `CommandError`, and the rest existed in the source tree but were not part of the public API, forcing consumers to fall back to brittle `error.message.startsWith(...)` or `error.name` string checks.

All concrete error classes, the `SandboxError` base class, the `ErrorCode`/`Operation` enums, the `createErrorFromResponse` adapter, and their associated context types are now exported. Consumers can write:

```ts
import { SessionAlreadyExistsError } from '@cloudflare/sandbox';

try {
  await sandbox.createSession({ id: 'my-session' });
} catch (error) {
  if (error instanceof SessionAlreadyExistsError) {
    // Type-safe access to error.sessionId, error.code, etc.
  }
}
```
