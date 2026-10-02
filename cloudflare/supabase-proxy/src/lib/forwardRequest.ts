import { FORWARDED_HEADERS, routeMethods } from '../const/proxyConfig';
import { jsonResponse, responseHeaders } from './responses';

export async function forwardRequest(
  request: Request,
  upstream: string,
  origin: string | null,
): Promise<Response> {
  const incoming = new URL(request.url);
  const destination = new URL(upstream);
  // Assign path/search separately: a client can never choose the upstream hostname.
  destination.pathname = incoming.pathname;
  destination.search = incoming.search;
  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value !== null) headers.set(name, value);
  }
  try {
    const response = await fetch(destination.toString(), {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
      cache: 'no-store',
    });
    const outgoing = responseHeaders(origin, response.headers);
    const location = response.headers.get('Location');
    if (response.status >= 300 && response.status < 400 && location) {
      const target = new URL(location, destination);
      if (target.origin !== upstream || !routeMethods(target.pathname).length) {
        await response.body?.cancel();
        return jsonResponse({ message: 'Supabase returned an unsupported redirect.' }, 502, origin);
      }
      const proxied = new URL(incoming.origin);
      proxied.pathname = target.pathname;
      proxied.search = target.search;
      outgoing.set('Location', proxied.toString());
    }
    // Keep binary uploads/downloads streamed. Never inspect tokens or report contents.
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: outgoing,
    });
  } catch {
    return jsonResponse(
      {
        message:
          'The proxy could not reach Supabase. Check the Worker SUPABASE_URL and the Supabase project status.',
      },
      502,
      origin,
    );
  }
}
