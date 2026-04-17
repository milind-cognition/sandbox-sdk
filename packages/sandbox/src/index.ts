// Export the main Sandbox class and utilities

// Export the new client architecture
export {
  BackupClient,
  CommandClient,
  DesktopClient,
  FileClient,
  GitClient,
  PortClient,
  ProcessClient,
  SandboxClient,
  UtilityClient
} from './clients';
export { getSandbox, Sandbox } from './sandbox';

// Legacy types are now imported from the new client architecture

// Required export for egress intercepting
export { ContainerProxy } from '@cloudflare/containers';
// Export core SDK types for consumers
export type {
  BackupOptions,
  BaseExecOptions,
  BucketCredentials,
  BucketProvider,
  CheckChangesOptions,
  CheckChangesResult,
  CodeContext,
  CreateContextOptions,
  DirectoryBackup,
  ExecEvent,
  ExecOptions,
  ExecResult,
  ExecutionResult,
  ExecutionSession,
  FileChunk,
  FileMetadata,
  FileStreamEvent,
  // File watch types
  FileWatchSSEEvent,
  GitCheckoutResult,
  ISandbox,
  ListFilesOptions,
  LocalMountBucketOptions,
  LogEvent,
  MountBucketOptions,
  Process,
  ProcessOptions,
  ProcessStatus,
  PtyOptions,
  RemoteMountBucketOptions,
  RestoreBackupResult,
  RunCodeOptions,
  SandboxOptions,
  SessionOptions,
  StreamOptions,
  WaitForLogResult,
  WaitForPortOptions,
  WatchOptions
} from '@repo/shared';
// Export type guards for runtime validation
export { isExecResult, isProcess, isProcessStatus } from '@repo/shared';
// Export all client types from new architecture
export type {
  BaseApiResponse,

  // Desktop client types
  ClickOptions,
  CommandsResponse,
  ContainerStub,

  // Utility client types
  CreateSessionRequest,
  CreateSessionResponse,
  CursorPositionResponse,
  DeleteSessionRequest,
  DeleteSessionResponse,
  Desktop,
  DesktopStartOptions,
  DesktopStartResponse,
  DesktopStatusResponse,
  DesktopStopResponse,
  ErrorResponse,

  // Command client types
  ExecuteRequest,
  ExecuteResponse as CommandExecuteResponse,

  // Port client types
  ExposePortRequest,
  FileOperationRequest,

  // Git client types
  GitCheckoutRequest,
  // Base client types
  HttpClientOptions as SandboxClientOptions,
  KeyInput,

  // File client types
  MkdirRequest,
  PingResponse,
  PortCloseResult,
  PortExposeResult,
  PortListResult,
  ProcessCleanupResult,
  ProcessInfoResult,
  ProcessKillResult,
  ProcessListResult,
  ProcessLogsResult,
  ProcessStartResult,
  ReadFileRequest,
  RequestConfig,
  ResponseHandler,
  ScreenSizeResponse,
  ScreenshotBytesResponse,
  ScreenshotOptions,
  ScreenshotRegion,
  ScreenshotResponse,
  ScrollDirection,
  SessionRequest,

  // Process client types
  StartProcessRequest,
  TypeOptions,
  UnexposePortRequest,
  WriteFileRequest
} from './clients';
export type {
  ExecutionCallbacks,
  InterpreterClient
} from './clients/interpreter-client.js';
// Export all error classes, adapter, and error constants
export {
  // Backup Errors
  BackupCreateError,
  BackupExpiredError,
  BackupNotFoundError,
  BackupRestoreError,
  // Code Interpreter Errors
  CodeExecutionError,
  CommandError,
  // Command Errors
  CommandNotFoundError,
  ContextNotFoundError,
  CustomDomainRequiredError,
  // Adapter function
  createErrorFromResponse,
  // Desktop Errors
  DesktopInvalidCoordinatesError,
  DesktopInvalidOptionsError,
  DesktopNotStartedError,
  DesktopProcessCrashedError,
  DesktopStartFailedError,
  DesktopUnavailableError,
  // Error constants
  ErrorCode,
  FileExistsError,
  // File System Errors
  FileNotFoundError,
  FileSystemError,
  FileTooLargeError,
  GitAuthenticationError,
  GitBranchNotFoundError,
  GitCheckoutError,
  GitCloneError,
  GitError,
  GitNetworkError,
  // Git Errors
  GitRepositoryNotFoundError,
  InterpreterNotReadyError,
  InvalidBackupConfigError,
  InvalidGitUrlError,
  InvalidPortError,
  Operation,
  PermissionDeniedError,
  // Port Errors
  PortAlreadyExposedError,
  PortError,
  PortInUseError,
  PortNotExposedError,
  ProcessError,
  // Process Readiness Errors
  ProcessExitedBeforeReadyError,
  // Process Errors
  ProcessNotFoundError,
  ProcessReadyTimeoutError,
  // Base error class
  SandboxError,
  ServiceNotRespondingError,
  // Session Errors
  SessionAlreadyExistsError,
  SessionDestroyedError,
  // Validation Errors
  ValidationFailedError
} from './errors';
// Export file streaming utilities for binary file support
export { collectFile, streamFile } from './file-stream';
// Export interpreter functionality
export { CodeInterpreter } from './interpreter.js';
export { proxyTerminal } from './pty';
// Re-export request handler utilities
export {
  proxyToSandbox,
  type RouteInfo,
  type SandboxEnv
} from './request-handler';
// Export SSE parser for converting ReadableStream to AsyncIterable
export {
  asyncIterableToSSEStream,
  parseSSEStream,
  responseToAsyncIterable
} from './sse-parser';
// Export bucket mounting errors
export {
  BucketMountError,
  BucketUnmountError,
  InvalidMountConfigError,
  MissingCredentialsError,
  S3FSMountError
} from './storage-mount/errors';
