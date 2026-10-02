export const DEFAULT_ALLOWED_ORIGINS = [
  'https://www.lap-attendance.vercel.app',
  'https://lap-attendance.vercel.app',
  'http://127.0.0.1:5179',
  'http://localhost:5179',
];

export const FORWARDED_HEADERS = [
  'accept',
  'authorization',
  'apikey',
  'content-type',
  'accept-profile',
  'content-profile',
  'prefer',
  'x-client-info',
  'x-supabase-api-version',
  'x-upsert',
  'cache-control',
  'range',
  'if-none-match',
  'if-modified-since',
];
export const EXPOSED_HEADERS =
  'content-range, content-disposition, etag, retry-after, x-attendance-proxy';
export const PREFLIGHT_MAX_AGE = '3600';

export const RPC_NAMES = new Set([
  'is_attendance_admin',
  'attendance_workspace',
  'attendance_commit',
  'attendance_original',
]);

export function routeMethods(path: string): string[] {
  if (path === '/auth/v1/token' || path === '/auth/v1/logout') return ['POST'];
  if (path === '/auth/v1/user' || path === '/auth/v1/settings') return ['GET'];
  if (path.startsWith('/rest/v1/rpc/') && RPC_NAMES.has(path.slice('/rest/v1/rpc/'.length)))
    return ['POST'];
  if (path.startsWith('/storage/v1/object/zoom-originals/')) return ['GET', 'HEAD', 'POST'];
  if (path.startsWith('/storage/v1/object/authenticated/zoom-originals/')) return ['GET', 'HEAD'];
  return [];
}
