import type { AppData } from '../types/appData';
import type { Json } from '../types/databaseTypes';

function changed<T extends { id: string }>(previous: T[], next: T[]) {
  const before = new Map(previous.map((row) => [row.id, JSON.stringify(row)]));
  return next.filter((row) => before.get(row.id) !== JSON.stringify(row));
}
function removed<T extends { id: string }>(previous: T[], next: T[]) {
  const ids = new Set(next.map((row) => row.id));
  return previous.filter((row) => !ids.has(row.id)).map((row) => row.id);
}
export function workspaceChanges(previous: AppData, next: AppData): Json {
  // Transport only changed entities. The database continues to own relational records.
  const imports = changed(previous.imports, next.imports);
  const importedCells = new Set(
    imports.flatMap((log) => log.changes.map((item) => log.sessionId + '/' + item.studentId)),
  );
  const newImports = imports.filter((log) => !previous.imports.some((old) => old.id === log.id));
  const beforeSessions = new Map(previous.sessions.map((session) => [session.id, session]));
  const headers = next.sessions.map((session) => ({ ...session, attendance: undefined }));
  const oldHeaders = previous.sessions.map((session) => ({ ...session, attendance: undefined }));
  const attendance = next.sessions.flatMap((session) =>
    Object.entries(session.attendance)
      .filter(
        ([studentId, cell]) =>
          !session.removed &&
          !importedCells.has(session.id + '/' + studentId) &&
          JSON.stringify(beforeSessions.get(session.id)?.attendance[studentId]) !==
            JSON.stringify(cell),
      )
      .map(([studentId, cell]) => ({ sessionId: session.id, studentId, ...cell })),
  );
  // Import approval saves its aliases on the server, in the same transaction as attendance.
  const aliasOnly = new Set(
    newImports.flatMap((log) =>
      (log.rows || []).filter((row) => row.saveEmail).map((row) => row.studentId),
    ),
  );
  const students = changed(previous.students, next.students).filter((student) => {
    const old = previous.students.find((item) => item.id === student.id);
    return (
      !aliasOnly.has(student.id) ||
      !old ||
      JSON.stringify({ ...old, aliases: [] }) !== JSON.stringify({ ...student, aliases: [] })
    );
  });
  const payload = {
    semesters: changed(previous.semesters, next.semesters),
    groups: changed(previous.groups, next.groups),
    classes: changed(previous.classes, next.classes),
    students,
    enrollments: changed(previous.enrollments, next.enrollments),
    sessions: changed(oldHeaders, headers),
    attendance,
    imports,
    deleteGroups: removed(previous.groups, next.groups),
    deleteClasses: removed(previous.classes, next.classes),
    events: next.events.filter((event) => !previous.events.some((old) => old.id === event.id)),
  };
  return JSON.parse(JSON.stringify(payload)) as Json;
}
