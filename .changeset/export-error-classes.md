---
'@cloudflare/sandbox': patch
---

Export concrete error classes (`SandboxError`, `SessionAlreadyExistsError`, `SessionDestroyedError`, `ProcessNotFoundError`, `FileNotFoundError`, `GitError`, and all other SDK error classes) from the package root. Consumers can now match errors with `instanceof` instead of falling back to `error.name` or message string checks:

```ts
import { SessionAlreadyExistsError } from '@cloudflare/sandbox';

try {
  await sandbox.startSession('foo');
} catch (err) {
  if (err instanceof SessionAlreadyExistsError) {
    console.log(err.sessionId);
  }
}
```

The `ErrorCode` and `Operation` enums, the `createErrorFromResponse` helper, and the per-error context types are also exported for advanced usage.
