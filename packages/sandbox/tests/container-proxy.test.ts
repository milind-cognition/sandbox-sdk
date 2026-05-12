import { describe, expect, it, vi } from 'vitest';

// Mock the base ContainerProxy from @cloudflare/containers
vi.mock('@cloudflare/containers', () => {
  class MockContainerProxy {
    async fetch(_request: Request): Promise<Response> {
      return new Response(null, { status: 200 });
    }
  }
  return {
    ContainerProxy: MockContainerProxy
  };
});

import { ContainerProxy } from '../src/container-proxy';

function createProxy(): ContainerProxy {
  // ContainerProxy is a WorkerEntrypoint; in tests we instantiate directly
  // with a minimal shape and override super.fetch via a spy.
  return new (ContainerProxy as unknown as new () => ContainerProxy)();
}

describe('ContainerProxy HEAD Content-Length preservation', () => {
  it('preserves Content-Length on HEAD responses', async () => {
    const proxy = createProxy();

    // Simulate upstream returning Content-Length: 22608 for a HEAD request
    vi.spyOn(
      Object.getPrototypeOf(Object.getPrototypeOf(proxy)),
      'fetch'
    ).mockResolvedValue(
      new Response(null, {
        status: 200,
        headers: { 'Content-Length': '22608' }
      })
    );

    const request = new Request('https://example.com/file.tar.gz', {
      method: 'HEAD'
    });

    const response = await proxy.fetch(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-length')).toBe('22608');
    expect(response.body).toBeNull();
  });

  it('preserves Content-Length: 0 on HEAD responses', async () => {
    const proxy = createProxy();

    vi.spyOn(
      Object.getPrototypeOf(Object.getPrototypeOf(proxy)),
      'fetch'
    ).mockResolvedValue(
      new Response(null, {
        status: 200,
        headers: { 'Content-Length': '0' }
      })
    );

    const request = new Request('https://example.com/empty', {
      method: 'HEAD'
    });

    const response = await proxy.fetch(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-length')).toBe('0');
  });

  it('does not alter GET responses', async () => {
    const proxy = createProxy();
    const originalBody = 'hello world';

    vi.spyOn(
      Object.getPrototypeOf(Object.getPrototypeOf(proxy)),
      'fetch'
    ).mockResolvedValue(
      new Response(originalBody, {
        status: 200,
        headers: { 'Content-Length': String(originalBody.length) }
      })
    );

    const request = new Request('https://example.com/data', {
      method: 'GET'
    });

    const response = await proxy.fetch(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(originalBody);
  });

  it('preserves non-Content-Length headers on HEAD responses', async () => {
    const proxy = createProxy();

    vi.spyOn(
      Object.getPrototypeOf(Object.getPrototypeOf(proxy)),
      'fetch'
    ).mockResolvedValue(
      new Response(null, {
        status: 200,
        headers: {
          'Content-Length': '5000',
          'Content-Type': 'application/octet-stream',
          ETag: '"abc123"'
        }
      })
    );

    const request = new Request('https://example.com/resource', {
      method: 'HEAD'
    });

    const response = await proxy.fetch(request);

    expect(response.headers.get('content-length')).toBe('5000');
    expect(response.headers.get('content-type')).toBe(
      'application/octet-stream'
    );
    expect(response.headers.get('etag')).toBe('"abc123"');
  });

  it('handles HEAD responses without Content-Length', async () => {
    const proxy = createProxy();

    vi.spyOn(
      Object.getPrototypeOf(Object.getPrototypeOf(proxy)),
      'fetch'
    ).mockResolvedValue(
      new Response(null, {
        status: 204
      })
    );

    const request = new Request('https://example.com/no-content', {
      method: 'HEAD'
    });

    const response = await proxy.fetch(request);

    expect(response.status).toBe(204);
    expect(response.headers.get('content-length')).toBeNull();
  });

  it('preserves status text on HEAD responses', async () => {
    const proxy = createProxy();

    vi.spyOn(
      Object.getPrototypeOf(Object.getPrototypeOf(proxy)),
      'fetch'
    ).mockResolvedValue(
      new Response(null, {
        status: 301,
        statusText: 'Moved Permanently',
        headers: {
          'Content-Length': '150',
          Location: 'https://example.com/new-path'
        }
      })
    );

    const request = new Request('https://example.com/old-path', {
      method: 'HEAD'
    });

    const response = await proxy.fetch(request);

    expect(response.status).toBe(301);
    expect(response.statusText).toBe('Moved Permanently');
    expect(response.headers.get('content-length')).toBe('150');
    expect(response.headers.get('location')).toBe(
      'https://example.com/new-path'
    );
  });
});
