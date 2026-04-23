import { describe, expect, it } from 'vitest';
import * as sdk from '../src';

describe('public error class exports', () => {
  const errorClassNames = [
    'SandboxError',
    'FileNotFoundError',
    'FileExistsError',
    'FileTooLargeError',
    'FileSystemError',
    'PermissionDeniedError',
    'CommandNotFoundError',
    'CommandError',
    'ProcessNotFoundError',
    'ProcessError',
    'SessionAlreadyExistsError',
    'SessionDestroyedError',
    'PortAlreadyExposedError',
    'PortNotExposedError',
    'InvalidPortError',
    'ServiceNotRespondingError',
    'PortInUseError',
    'PortError',
    'CustomDomainRequiredError',
    'GitRepositoryNotFoundError',
    'GitAuthenticationError',
    'GitBranchNotFoundError',
    'GitNetworkError',
    'GitCloneError',
    'GitCheckoutError',
    'InvalidGitUrlError',
    'GitError',
    'InterpreterNotReadyError',
    'ContextNotFoundError',
    'CodeExecutionError',
    'ValidationFailedError',
    'ProcessReadyTimeoutError',
    'ProcessExitedBeforeReadyError',
    'BackupNotFoundError',
    'BackupExpiredError',
    'InvalidBackupConfigError',
    'BackupCreateError',
    'BackupRestoreError',
    'DesktopNotStartedError',
    'DesktopStartFailedError',
    'DesktopUnavailableError',
    'DesktopProcessCrashedError',
    'DesktopInvalidOptionsError',
    'DesktopInvalidCoordinatesError'
  ] as const;

  it.each(errorClassNames)('exports %s as a class extending Error', (name) => {
    const exported = (sdk as Record<string, unknown>)[name];
    expect(typeof exported).toBe('function');
    const instance = Object.create(
      (exported as { prototype: object }).prototype
    );
    expect(instance).toBeInstanceOf(Error);
  });

  it('SandboxError subclasses preserve instanceof for error matching', () => {
    const errorResponse = {
      code: 'SESSION_ALREADY_EXISTS',
      message: 'SessionAlreadyExistsError: named session exists',
      context: { sessionId: 'abc' },
      httpStatus: 409,
      operation: 'session_create',
      timestamp: new Date().toISOString()
    };

    const err = new sdk.SessionAlreadyExistsError(errorResponse as never);
    expect(err).toBeInstanceOf(sdk.SessionAlreadyExistsError);
    expect(err).toBeInstanceOf(sdk.SandboxError);
    expect(err).toBeInstanceOf(Error);
    expect(err.sessionId).toBe('abc');
    expect(err.name).toBe('SessionAlreadyExistsError');
  });

  it('exports ErrorCode and Operation constants', () => {
    expect(typeof sdk.ErrorCode).toBe('object');
    expect(typeof sdk.Operation).toBe('object');
  });

  it('exports createErrorFromResponse helper', () => {
    expect(typeof sdk.createErrorFromResponse).toBe('function');
  });
});
