import type { ConnectionRouteResponse } from '../src/features/connection/types/connectionRouteTypes';

export const config = { runtime: 'edge' };

export default async function handler(req: Pick<Request, 'method'>, res?: ConnectionRouteResponse) {
  const responseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'private, no-store',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };

  try {
    const method = req?.method ?? 'GET';
    if (method !== 'GET') {
      if (res && typeof res.status === 'function') {
        return res.status(405).json({ error: 'Method not allowed.' });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
        status: 405,
        headers: { ...responseHeaders, Allow: 'GET' },
      });
    }

    // Direct Supabase connection is the primary reliable route globally.
    // Cloudflare Workers (*.workers.dev) are blocked by ISPs in Myanmar.
    const route = 'direct';

    if (res && typeof res.status === 'function') {
      Object.entries(responseHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(200).json({ route });
    }

    return new Response(JSON.stringify({ route }), {
      status: 200,
      headers: responseHeaders,
    });
  } catch {
    if (res && typeof res.status === 'function') {
      return res.status(200).json({ route: 'direct' });
    }
    return new Response(JSON.stringify({ route: 'direct' }), {
      status: 200,
      headers: responseHeaders,
    });
  }
}
