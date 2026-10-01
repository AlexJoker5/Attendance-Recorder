import type { AppData } from '../types/appData';

// Local mode mirrors database creation metadata. Never backfill old records with today's date.
export function stampCreatedDates(previous: AppData | undefined, next: AppData) {
  const at = new Date().toISOString();
  function stampRecords<T extends { id: string; createdAt?: string }>(before: T[], after: T[]) {
    const existing = new Map(before.map((record) => [record.id, record]));
    after.forEach((record) => {
      const old = existing.get(record.id);
      if (!old) record.createdAt = at;
      else if (old.createdAt) record.createdAt = old.createdAt;
      else delete record.createdAt;
    });
  }
  stampRecords(previous?.semesters ?? [], next.semesters);
  stampRecords(previous?.groups ?? [], next.groups);
  stampRecords(previous?.classes ?? [], next.classes);
  stampRecords(previous?.students ?? [], next.students);
  stampRecords(previous?.enrollments ?? [], next.enrollments);
  stampRecords(previous?.sessions ?? [], next.sessions);
  const existingSessions = new Map(
    previous?.sessions.map((session) => [session.id, session]) ?? [],
  );
  next.sessions.forEach((session) => {
    const old = existingSessions.get(session.id);
    Object.entries(session.attendance).forEach(([studentId, cell]) => {
      const oldCell = old?.attendance[studentId];
      if (!oldCell) cell.createdAt = at;
      else if (oldCell.createdAt) cell.createdAt = oldCell.createdAt;
      else delete cell.createdAt;
    });
  });
}
