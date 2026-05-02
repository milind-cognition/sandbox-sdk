import { ContainerProxy as BaseContainerProxy } from '@cloudflare/containers';

/**
 * Extended ContainerProxy that preserves Content-Length on HEAD responses.
 *
 * The Workers fetch() API returns HEAD responses with a null body, which
 * causes Content-Length to be recomputed as 0 when the response crosses
 * service-binding boundaries. This subclass captures the original
 * Content-Length from the upstream response and rebuilds the response so
 * the header survives serialization back to the container.
 */
export class ContainerProxy extends BaseContainerProxy {
  override async fetch(request: Request): Promise<Response> {
    const response = await super.fetch(request);

    if (request.method === 'HEAD') {
      const contentLength = response.headers.get('content-length');
      if (contentLength !== null) {
        const headers = new Headers(response.headers);
        headers.set('content-length', contentLength);
        return new Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers
        });
      }
    }

    return response;
  }
}
