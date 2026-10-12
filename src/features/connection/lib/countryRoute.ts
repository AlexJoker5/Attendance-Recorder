import type { ConnectionRoute } from '../types/connectionTypes';

export function countryRoute(_value: string | null): ConnectionRoute {
  // Always use direct connection as primary route because Cloudflare Workers (*.workers.dev)
  // are blocked by telecom ISPs in Myanmar and other regions.
  return 'direct';
}
