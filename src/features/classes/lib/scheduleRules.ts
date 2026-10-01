import { recordEvent } from '@/app/lib/auditEvents';
import type { AppData } from '@/app/types/appData';
import { makeSession } from '@/features/attendance/lib/sessionFactory';
import type { TeachingClass } from '../types/classTypes';
import { weeklyDates } from './weeklyDates';
export function scheduleDiff(data: AppData, cls: TeachingClass) {
  const existing = data.sessions.filter((session) => session.classId === cls.id);
  const dates = weeklyDates(cls.startDate, cls.endDate, cls.weekday);
  const add = dates.filter((date) => !existing.some((session) => session.date === date));
  const restore = existing.filter(
    (session) =>
      dates.includes(session.date) && session.removed && session.removedBy === 'schedule',
  );
  const skip = existing.filter(
    (session) =>
      dates.includes(session.date) && session.removed && session.removedBy !== 'schedule',
  );
  const outside = existing.filter((session) => !session.removed && !dates.includes(session.date));
  const retain = outside.filter(
    (session) =>
      !session.generated ||
      session.extra ||
      session.finalized ||
      Object.values(session.attendance).some(
        (cell) => cell.status !== 'Unmarked' || cell.remark || cell.source !== '—',
      ),
  );
  const remove = outside.filter((session) => !retain.includes(session));
  return { add, restore, skip, retain, remove };
}
export function applySchedule(data: AppData, cls: TeachingClass) {
  data.classes.find((item) => item.id === cls.id)!.completed = false;
  const plan = scheduleDiff(data, cls);
  plan.remove.forEach((session) => {
    session.removed = true;
    session.removedBy = 'schedule';
  });
  plan.restore.forEach((session) => {
    session.removed = false;
    delete session.removedBy;
  });
  data.sessions.push(...plan.add.map((date) => makeSession(data, cls.id, date, true)));
  recordEvent(
    data,
    `Changed ${cls.name} schedule: ${plan.add.length} added, ${plan.remove.length} removed, ${plan.retain.length} retained`,
  );
}
