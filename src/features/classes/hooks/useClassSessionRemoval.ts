import { removeSession } from '@/features/attendance/lib/sessionRules';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useState } from 'react';
import type { ClassSessionRemovalOptions } from '../types/classSessionRemovalTypes';

export function useClassSessionRemoval({ data, change, classId }: ClassSessionRemovalOptions) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isRemovingSession, setIsRemovingSession] = useState(false);
  const [sessionRemovalError, setSessionRemovalError] = useState('');
  const sessionToRemove = data?.sessions.find(
    (session) => session.id === selectedId && session.classId === classId,
  );
  function requestRemoveClassSession(sessionId: string) {
    if (isRemovingSession) return;
    setSessionRemovalError('');
    setSelectedId(sessionId);
  }
  function cancelRemoveClassSession() {
    if (isRemovingSession) return;
    setSelectedId(null);
    setSessionRemovalError('');
  }
  async function confirmRemoveClassSession() {
    if (!sessionToRemove || isRemovingSession) return;
    setIsRemovingSession(true);
    setSessionRemovalError('');
    try {
      await change((next) => removeSession(next, sessionToRemove.id));
      setSelectedId(null);
    } catch (reason) {
      setSessionRemovalError(getErrorMessage(reason));
    } finally {
      setIsRemovingSession(false);
    }
  }
  return {
    requestRemoveClassSession,
    cancelRemoveClassSession,
    confirmRemoveClassSession,
    sessionToRemove,
    isRemovingSession,
    sessionRemovalError,
  };
}
