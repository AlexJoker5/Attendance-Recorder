import { recordEvent } from '@/app/lib/auditEvents';
import type { AppData } from '@/app/types/appData';
import { today } from '@/utils/dateUtils';
import { uid } from '@/utils/uid';
import { blankCell } from './attendanceCell';
import { roster } from './attendanceSelectors';
export function finalizeSession(data: AppData, sessionId: string) {
  const session = data.sessions.find((item) => item.id === sessionId);
  if (!session || session.removed || session.date > today())
    throw new Error('Only held sessions dated today or earlier can be finalized.');
  roster(data, session.classId).forEach((enrollment) => {
    const cell = session.attendance[enrollment.studentId] || blankCell();
    if (cell.status === 'Unmarked') {
      if (enrollment.status !== 'active') return;
      const credit = !session.extra && session.date < enrollment.joined;
      Object.assign(cell, {
        status: credit ? 'Present' : 'Absent',
        source: credit ? 'Pre-enrollment credit' : 'Finalization',
        revision: uid(),
      });
      if (credit && !cell.remark) cell.remark = 'Pre-enrollment credit';
      session.attendance[enrollment.studentId] = cell;
    }
  });
  session.finalized = true;
  recordEvent(data, `Finalized session ${session.date}`);
}

export function removeSession(data: AppData, sessionId: string) {
  const session = data.sessions.find((item) => item.id === sessionId);
  if (!session) throw new Error('Session not found.');
  const cls = data.classes.find((item) => item.id === session.classId);
  const group = data.groups.find((item) => item.id === cls?.groupId);
  const semester = data.semesters.find((item) => item.id === group?.semesterId);
  if (!cls || !group || !semester) throw new Error('Session not found.');
  if (semester.archived || group.archived || cls.archived)
    throw new Error('Restore the semester, group, and class before removing a session.');
  if (session.removed) throw new Error('This session is already removed.');
  session.removed = true;
  session.removedBy = 'manual';
  cls.completed = false;
  recordEvent(data, 'Removed session ' + session.date);
}
