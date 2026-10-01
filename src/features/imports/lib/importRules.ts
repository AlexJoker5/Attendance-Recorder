import { recordEvent } from '@/app/lib/auditEvents';
import type { AppData } from '@/app/types/appData';
import { blankCell } from '@/features/attendance/lib/attendanceCell';
import { roster } from '@/features/attendance/lib/attendanceSelectors';
import type { AttendanceCell } from '@/features/attendance/types/attendanceTypes';
import { assertEmail } from '@/features/students/lib/studentEmails';
import { uid } from '@/utils/uid';
import type { ImportRow } from '../types/importTypes';
export function applyImport(
  data: AppData,
  sessionId: string,
  rows: ImportRow[],
  filename: string,
  importId: string = uid(),
) {
  const session = data.sessions.find((item) => item.id === sessionId);
  if (!session || session.removed) throw new Error('Choose an active session.');
  const cls = data.classes.find((item) => item.id === session.classId)!;
  const group = data.groups.find((item) => item.id === cls.groupId)!;
  const semester = data.semesters.find((item) => item.id === group.semesterId)!;
  if (cls.archived || group.archived || semester.archived)
    throw new Error('Restore the class, group, and semester before importing.');
  const decisions = new Map<string, 'keep' | 'replace'>();
  rows.forEach((row) => {
    if (!row.studentId) throw new Error('Resolve or ignore every attendee first.');
    if (row.studentId === 'ignore') return;
    if (!roster(data, session.classId).some((item) => item.studentId === row.studentId))
      throw new Error('Selected student is not enrolled in this group.');
    const cell = session.attendance[row.studentId] || blankCell();
    const conflict =
      cell.status === 'Leave' ||
      (cell.status === 'Absent' && cell.source !== 'Finalization') ||
      cell.source === 'Pre-enrollment credit';
    if (conflict && !row.decision)
      throw new Error(`Choose whether to keep or replace attendance for ${row.name}.`);
    const decision = row.decision === 'keep' ? 'keep' : 'replace';
    if (decisions.has(row.studentId) && decisions.get(row.studentId) !== decision)
      throw new Error('Repeated attendee rows have conflicting decisions.');
    decisions.set(row.studentId, decision);
    if (row.saveEmail) {
      assertEmail(data, row.email, row.studentId);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email))
        throw new Error('A valid email is required to save an additional email.');
      const other = rows.find(
        (item) => item.saveEmail && item.email === row.email && item.studentId !== row.studentId,
      );
      if (other) throw new Error('One email cannot be saved for two students.');
    }
  });
  if (!decisions.size) throw new Error('No matched students to import.');
  rows
    .filter((row) => row.saveEmail && row.studentId !== 'ignore')
    .forEach((row) => {
      const student = data.students.find((item) => item.id === row.studentId)!;
      if (row.email !== student.email && !student.aliases.includes(row.email))
        student.aliases.push(row.email);
    });
  const id = importId;
  const changes: {
    studentId: string;
    name: string;
    before: AttendanceCell;
    after: AttendanceCell;
  }[] = [];
  decisions.forEach((decision, studentId) => {
    if (decision === 'keep') return;
    const before = structuredClone(session.attendance[studentId] || blankCell());
    const after: AttendanceCell = { ...before, status: 'Present', source: 'Import', revision: id };
    session.attendance[studentId] = after;
    changes.push({
      studentId,
      name: data.students.find((student) => student.id === studentId)!.name,
      before,
      after: structuredClone(after),
    });
  });
  session.finalized = false;
  data.imports.push({
    id,
    sessionId,
    filename,
    at: new Date().toISOString(),
    count: decisions.size,
    changes,
  });
  recordEvent(data, `Imported ${filename} into ${session.date}`);
  return id;
}
