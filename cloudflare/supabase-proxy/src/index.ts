import { routeMethods } from './const/proxyConfig';
import { allowedOrigins, upstreamOrigin } from './lib/configuration';
import { forwardRequest } from './lib/forwardRequest';
import { jsonResponse, preflight } from './lib/responses';
import type { WorkerEnvironment } from './types/workerTypes';

export default {
  async fetch(request: Request, env: WorkerEnvironment): Promise<Response> {
    const path = new URL(request.url).pathname;
    const requestedOrigin = request.headers.get('Origin');
    let origin: string | null = null;
    let upstream: string;
    try {
      const allowed = allowedOrigins(env);
      if (requestedOrigin && !allowed.has(requestedOrigin)) {
        return jsonResponse({ message: 'This website origin is not allowed.' }, 403, null);
      }
      origin = requestedOrigin;
      upstream = upstreamOrigin(env);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Invalid Worker configuration.';
      if (path === '/health' && request.method === 'GET') {
        return jsonResponse(
          { ok: true, service: 'attendance-api', configured: false, message },
          200,
          origin,
        );
      }
      return jsonResponse({ message }, 503, origin);
    }
    if (path === '/health' && request.method === 'GET') {
      // Checks Worker reachability and configuration only; it does not query Supabase.
      return jsonResponse({ ok: true, service: 'attendance-api', configured: true }, 200, origin);
    }
    const methods = routeMethods(path);
    if (!methods.length)
      return jsonResponse(
        { message: 'This API route is not supported by Attendance Admin.' },
        404,
        origin,
      );
    if (request.method === 'OPTIONS') return preflight(request, origin, methods);
    if (!methods.includes(request.method))
      return jsonResponse({ message: 'This request method is not allowed.' }, 405, origin);
    if (!request.headers.get('apikey'))
      return jsonResponse({ message: 'A Supabase publishable API key is required.' }, 401, origin);
    // Supabase Auth, owner-checked RPCs and Storage RLS still authorize every request.
    return forwardRequest(request, upstream, origin);
  },
};
