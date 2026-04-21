---
'@cloudflare/sandbox': patch
---

Export concrete error classes from the package root so consumers can handle errors with `instanceof` instead of string checks on `error.name` or `error.code`.

Newly re-exported from `@cloudflare/sandbox`: `SandboxError`, `FileNotFoundError`, `FileExistsError`, `FileTooLargeError`, `FileSystemError`, `PermissionDeniedError`, `CommandNotFoundError`, `CommandError`, `ProcessNotFoundError`, `ProcessError`, `SessionAlreadyExistsError`, `SessionDestroyedError`, `PortAlreadyExposedError`, `PortNotExposedError`, `InvalidPortError`, `ServiceNotRespondingError`, `PortInUseError`, `PortError`, `CustomDomainRequiredError`, `GitRepositoryNotFoundError`, `GitAuthenticationError`, `GitBranchNotFoundError`, `GitNetworkError`, `GitCloneError`, `GitCheckoutError`, `InvalidGitUrlError`, `GitError`, `InterpreterNotReadyError`, `ContextNotFoundError`, `CodeExecutionError`, and `ValidationFailedError`.
