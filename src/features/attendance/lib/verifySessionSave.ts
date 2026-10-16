import type { AppData } from '@/app/types/appData';

export function verifySessionSave(saved: AppData, sessionId: string, finalized: boolean) {
  const session = saved.sessions.find((item) => item.id === sessionId);
  if (!session)
    throw new Error('The saved session could not be found. Reload before trying again.');
  if (session.finalized !== finalized)
    throw new Error(
      finalized
        ? 'The server returned this session as Draft. Finalization was not confirmed. Reload and try again; if it persists, check the Supabase workflow migrations.'
        : 'The server did not confirm the draft status. Reload the session before trying again.',
    );
  return session;
}
