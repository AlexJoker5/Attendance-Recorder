import { connectionRouter, localMode, publicConnectionConfig, supabase } from '@/lib/supabase';
import { SHARING_SETUP_MESSAGE } from '../const/sharingConfig';
import { classShareSchema, publicClassSchema, shareKeySchema } from '../schemas/sharingSchemas';
import type { ShareAction } from '../types/sharingTypes';
import { PublicShareError } from './sharingErrors';

export async function readClassShare(classId: string) {
  if (localMode) return (await import('./localSharing')).readLocalShare(classId);
  if (!supabase) throw new Error('Sign in before managing a class link.');
  const { data, error } = await supabase.rpc('attendance_class_share', { p_class: classId });
  if (error)
    throw new Error(
      error.code === 'PGRST202'
        ? SHARING_SETUP_MESSAGE
        : 'Sharing settings could not be loaded. Please try again.',
    );
  return classShareSchema.parse(data);
}
export async function changeClassShare(
  classId: string,
  action: ShareAction,
  token: string | undefined,
  expected: string | null,
) {
  if (localMode)
    return (await import('./localSharing')).changeLocalShare(classId, action, token, expected);
  if (!supabase) throw new Error('Sign in before managing a class link.');
  const { data, error } = await supabase.rpc('attendance_class_share', {
    p_class: classId,
    p_action: action,
    p_token: token,
    p_expected_token: expected ?? undefined,
  });
  if (error)
    throw new Error(
      error.code === 'PGRST202'
        ? SHARING_SETUP_MESSAGE
        : 'The link change could not be confirmed. Refresh sharing settings before trying again.',
    );
  return classShareSchema.parse(data);
}
export async function readPublicClass(token: string, sessionId?: string, signal?: AbortSignal) {
  if (!shareKeySchema.safeParse(token).success) throw new PublicShareError(403);
  if (localMode) return (await import('./localSharing')).readLocalPublicClass(token, sessionId);
  if (
    sessionId &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)
  )
    throw new PublicShareError(403);
  const { url, key } = publicConnectionConfig;
  if (!url || !key || !connectionRouter)
    throw new Error('The public connection is not configured. Please contact your teacher.');
  // No SDK Auth, owner JWT, browser cookies, or workspace query is used for public reads.
  const response = await connectionRouter.fetch(`${url}/rest/v1/rpc/attendance_public_class`, {
    method: 'POST',
    credentials: 'omit',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    signal,
    headers: { apikey: key, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ p_token: token, ...(sessionId ? { p_session: sessionId } : {}) }),
  });
  if (!response.ok) {
    if (response.status === 404)
      throw new Error('Public sharing is not available yet. Please contact your teacher.');
    throw new PublicShareError(response.status);
  }
  return publicClassSchema.parse(await response.json());
}
