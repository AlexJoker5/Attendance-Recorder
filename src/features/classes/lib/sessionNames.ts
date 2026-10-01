import type { ClassSession } from '@/features/attendance/types/attendanceTypes';

// Number active regular sessions before table filtering; removal and restoration recalculate the sequence.
export function withSessionNames(sessions: readonly ClassSession[]) {
  const regular = sessions
    .filter((session) => !session.extra && !session.removed)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const weeks = new Map(regular.map((session, index) => [session.id, index + 1]));
  return sessions.map((session) => ({ ...session, weekNumber: weeks.get(session.id) ?? null }));
}
