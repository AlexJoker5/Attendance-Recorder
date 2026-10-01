import { MAX_WEEKLY_SESSIONS } from '../const/scheduleDefaults';
export function weeklyDates(start: string, end: string, weekday: number) {
  const cursor = new Date(start + 'T00:00:00Z');
  const last = new Date(end + 'T00:00:00Z');
  const dates: string[] = [];
  if (!Number.isFinite(+cursor) || !Number.isFinite(+last) || last < cursor) return dates;
  cursor.setUTCDate(cursor.getUTCDate() + ((weekday - cursor.getUTCDay() + 7) % 7));
  while (cursor <= last && dates.length < MAX_WEEKLY_SESSIONS) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 7);
  }
  return dates;
}
