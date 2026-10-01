import { useAppData } from '@/app/hooks/useAppData';
import { recordEvent } from '@/app/lib/auditEvents';
import { attendanceResult } from '@/features/attendance/lib/attendanceResult';
import { roster } from '@/features/attendance/lib/attendanceSelectors';
import { makeSession } from '@/features/attendance/lib/sessionFactory';
import { withSessionNames } from '../lib/sessionNames';
import { today } from '@/utils/dateUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useClassSessionRemoval } from './useClassSessionRemoval';
import type { SessionValues } from '../schemas/sessionSchema';
export function useClassDetails() {
  const { classId } = useParams();
  const { data, change } = useAppData();
  const sessionRemoval = useClassSessionRemoval({ data, change, classId });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<'edit' | 'session' | 'archive' | 'complete' | null>(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('sessions');
  const [state, setState] = useState('active');
  const [type, setType] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const cls = data?.classes.find((item) => item.id === classId);
  if (!data || !cls) return null;
  const group = data.groups.find((item) => item.id === cls.groupId)!;
  const semester = data.semesters.find((item) => item.id === group.semesterId)!;
  const readonly = semester.archived || group.archived || cls.archived;
  const all = data.sessions.filter((session) => session.classId === cls.id);
  const rows = withSessionNames(all)
    .filter(
      (session) =>
        (state === 'all' ||
          (state === 'removed'
            ? session.removed
            : !session.removed &&
              (state === 'active' ||
                (state === 'finalized' && session.finalized) ||
                (state === 'draft' && !session.finalized)))) &&
        (type === 'all' || (type === 'extra') === session.extra) &&
        (!from || session.date >= from) &&
        (!to || session.date <= to),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const regular = all.filter((session) => !session.extra && !session.removed);
  const canComplete =
    regular.length > 0 && regular.every((session) => session.finalized && session.date <= today());
  const results = roster(data, cls.id).map((enrollment) => ({
    enrollment,
    student: data.students.find((item) => item.id === enrollment.studentId)!,
    ...attendanceResult(data, cls, enrollment),
  }));
  const confirmClassAction = async () => {
    try {
      await change((next) => {
        const current = next.classes.find((item) => item.id === cls.id)!;
        if (dialog === 'complete') current.completed = !cls.completed;
        else if (!all.length) next.classes = next.classes.filter((item) => item.id !== cls.id);
        else current.archived = !cls.archived;
        recordEvent(next, 'Changed class state: ' + cls.name);
      });
      setDialog(null);
      if (!all.length && dialog === 'archive') navigate('/groups/' + group.id);
    } catch (reason) {
      setError(String(reason));
    }
  };

  const addSession = async (values: SessionValues) => {
    await change((next) => {
      if (values.date < semester.start || values.date > semester.end)
        throw new Error('Session date must be within this semester.');
      if (
        next.sessions.some((session) => session.classId === cls.id && session.date === values.date)
      )
        throw new Error('A session exists for this date. Restore it if it was removed.');
      next.sessions.push(makeSession(next, cls.id, values.date, false, values.extra));
      next.classes.find((item) => item.id === cls.id)!.completed = false;
      recordEvent(next, 'Added session ' + values.date);
    });
    setDialog(null);
  };
  const restoreClassSession = async (sessionId: string) => {
    try {
      await change((next) => {
        const session = next.sessions.find((item) => item.id === sessionId)!;
        session.removed = false;
        delete session.removedBy;
        next.classes.find((item) => item.id === cls.id)!.completed = false;
        recordEvent(next, 'Restored session ' + session.date);
      });
    } catch (reason) {
      setError(String(reason));
    }
  };
  return {
    ...sessionRemoval,
    restoreClassSession,
    addSession,
    cls,
    group,
    t,
    readonly,
    setDialog,
    view,
    setView,
    error,
    state,
    setState,
    type,
    setType,
    from,
    setFrom,
    to,
    setTo,
    rows,
    change,
    setError,
    results,
    canComplete,
    semester,
    all,
    dialog,
    confirmClassAction,
  };
}
export type ClassDetailsModel = NonNullable<ReturnType<typeof useClassDetails>>;
