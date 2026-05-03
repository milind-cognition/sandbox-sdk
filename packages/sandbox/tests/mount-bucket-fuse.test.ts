import type { ExecResult } from '@repo/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { connect, Sandbox } from '../src/sandbox';
import { S3FSMountError } from '../src/storage-mount/errors';

vi.mock('./interpreter', () => ({
  CodeInterpreter: vi.fn().mockImplementation(() => ({}))
}));

vi.mock('@cloudflare/containers', () => {
  const MockContainer = class Container {
    ctx: any;
    env: any;
    sleepAfter: string | number = '10m';
    constructor(ctx: any, env: any) {
      this.ctx = ctx;
      this.env = env;
    }
    async fetch(): Promise<Response> {
      return new Response('Mock Container fetch');
    }
    async containerFetch(): Promise<Response> {
      return new Response('Mock Container HTTP fetch');
    }
    async getState() {
      return { status: 'healthy' };
    }
    renewActivityTimeout() {}
  };

  return {
    Container: MockContainer,
    getContainer: vi.fn(),
    switchPort: vi.fn()
  };
});

interface MockStorage {
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  list: ReturnType<typeof vi.fn>;
}

interface MockCtx {
  storage: MockStorage;
  blockConcurrencyWhile: ReturnType<typeof vi.fn>;
  waitUntil: ReturnType<typeof vi.fn>;
  id: {
    toString: () => string;
    equals: ReturnType<typeof vi.fn>;
    name: string;
  };
}

const okResult = (overrides: Partial<ExecResult> = {}): ExecResult => ({
  success: true,
  stdout: '',
  stderr: '',
  exitCode: 0,
  command: '',
  duration: 0,
  timestamp: new Date().toISOString(),
  ...overrides
});

const failResult = (overrides: Partial<ExecResult> = {}): ExecResult => ({
  success: false,
  stdout: '',
  stderr: '',
  exitCode: 1,
  command: '',
  duration: 0,
  timestamp: new Date().toISOString(),
  ...overrides
});

describe('Sandbox.mountBucket - FUSE verification', () => {
  let sandbox: Sandbox;
  let mockCtx: MockCtx;
  let mockEnv: Record<string, unknown>;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockCtx = {
      storage: {
        get: vi.fn().mockResolvedValue(null),
        put: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
        list: vi.fn().mockResolvedValue(new Map())
      } as any,
      blockConcurrencyWhile: vi
        .fn()
        .mockImplementation(
          <T>(callback: () => Promise<T>): Promise<T> => callback()
        ),
      waitUntil: vi.fn(),
      id: {
        toString: () => 'test-sandbox-id',
        equals: vi.fn(),
        name: 'test-sandbox'
      } as any
    };

    mockEnv = {};

    const stub = new Sandbox(
      mockCtx as unknown as ConstructorParameters<typeof Sandbox>[0],
      mockEnv
    );

    await vi.waitFor(() => {
      expect(mockCtx.blockConcurrencyWhile).toHaveBeenCalled();
    });

    sandbox = Object.assign(stub, {
      wsConnect: connect(stub)
    });

    vi.spyOn(sandbox.client.utils, 'createSession').mockResolvedValue({
      success: true,
      id: 'sandbox-default',
      message: 'Created'
    } as any);

    vi.spyOn(sandbox.client.files, 'writeFile').mockResolvedValue({
      success: true,
      path: '/tmp/.passwd-s3fs',
      timestamp: new Date().toISOString()
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws S3FSMountError when s3fs daemonises but the FUSE filesystem never appears', async () => {
    const calls: string[] = [];

    vi.spyOn(sandbox.client.commands, 'execute').mockImplementation(
      async (command: string) => {
        calls.push(command);
        // tail of s3fs log captures the underlying bucket-check failure
        if (command.startsWith('tail -c')) {
          return okResult({
            stdout:
              's3fs: CURLE_HTTP_RETURNED_ERROR\ns3fs: HTTP response code 403, retrying...\ns3fs: Exiting FUSE event loop due to errors',
            command
          });
        }
        // mountpoint check never succeeds — FUSE filesystem was never attached
        if (command.startsWith('mountpoint -q')) {
          return failResult({ command });
        }
        // s3fs and every other infrastructure command (mkdir, chmod, rm,
        // fusermount, rmdir) succeeds with exit 0 — mirrors the silent
        // success the daemonised s3fs parent reports.
        return okResult({ command });
      }
    );

    await expect(
      sandbox.mountBucket('not-a-real-bucket', '/mnt/bogus', {
        endpoint: 'https://example.r2.cloudflarestorage.com',
        provider: 'r2',
        credentials: {
          accessKeyId: 'AKIATEST',
          secretAccessKey: 'secret'
        }
      })
    ).rejects.toBeInstanceOf(S3FSMountError);

    // Surfaced error includes the captured s3fs log, not the empty parent
    // stdout/stderr.
    await expect(
      sandbox.mountBucket('not-a-real-bucket', '/mnt/bogus2', {
        endpoint: 'https://example.r2.cloudflarestorage.com',
        provider: 'r2',
        credentials: {
          accessKeyId: 'AKIATEST',
          secretAccessKey: 'secret'
        }
      })
    ).rejects.toThrow(/HTTP response code 403/);

    // Polled mountpoint -q at least once before giving up
    expect(calls.some((cmd) => cmd.startsWith('mountpoint -q'))).toBe(true);

    // Cleanup ran: orphan FUSE entry detached, password file removed,
    // mount-point directory removed, s3fs log removed.
    expect(calls.some((cmd) => cmd.startsWith('fusermount -uz'))).toBe(true);
    expect(calls.some((cmd) => /^rm -f .*\.passwd-s3fs/.test(cmd))).toBe(true);
    expect(
      calls.some((cmd) => /^rmdir .* 2>\/dev\/null \|\| true$/.test(cmd))
    ).toBe(true);
    expect(calls.some((cmd) => /^rm -f .*\.s3fs-log-/.test(cmd))).toBe(true);
  }, 15000);

  it('returns successfully once mountpoint -q reports the FUSE filesystem', async () => {
    vi.spyOn(sandbox.client.commands, 'execute').mockImplementation(
      async (command: string) => {
        if (command.startsWith('mountpoint -q')) {
          return okResult({ command });
        }
        return okResult({ command });
      }
    );

    await expect(
      sandbox.mountBucket('valid-bucket', '/mnt/data', {
        endpoint: 'https://example.r2.cloudflarestorage.com',
        provider: 'r2',
        credentials: {
          accessKeyId: 'AKIATEST',
          secretAccessKey: 'secret'
        }
      })
    ).resolves.toBeUndefined();
  });

  it('surfaces s3fs log tail when s3fs itself exits non-zero', async () => {
    vi.spyOn(sandbox.client.commands, 'execute').mockImplementation(
      async (command: string) => {
        if (command.startsWith('s3fs ')) {
          return failResult({
            command,
            exitCode: 1,
            stderr: ''
          });
        }
        if (command.startsWith('tail -c')) {
          return okResult({
            stdout: 's3fs: unable to connect to endpoint',
            command
          });
        }
        return okResult({ command });
      }
    );

    await expect(
      sandbox.mountBucket('any-bucket', '/mnt/any', {
        endpoint: 'https://example.r2.cloudflarestorage.com',
        provider: 'r2',
        credentials: {
          accessKeyId: 'AKIATEST',
          secretAccessKey: 'secret'
        }
      })
    ).rejects.toThrow(/unable to connect to endpoint/);
  });
});
