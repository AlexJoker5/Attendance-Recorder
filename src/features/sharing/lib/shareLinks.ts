import { PUBLIC_CLASS_PATH } from '../const/sharingConfig';
import { shareKeySchema } from '../schemas/sharingSchemas';

export function createShareKey() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}
export function publicClassPath(token: string, sessionId?: string) {
  const path = sessionId
    ? `${PUBLIC_CLASS_PATH}/sessions/${encodeURIComponent(sessionId)}`
    : PUBLIC_CLASS_PATH;
  return `${path}#key=${token}`;
}
export function shareUrl(token: string) {
  return new URL(publicClassPath(token), window.location.origin).href;
}
export function parseShareKey(hash: string) {
  const token = new URLSearchParams(hash.replace(/^#/, '')).get('key');
  const parsed = shareKeySchema.safeParse(token);
  return parsed.success ? parsed.data : null;
}
