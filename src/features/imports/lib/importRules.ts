import { recordEvent } from '@/app/lib/auditEvents';
import type { AppData } from '@/app/types/appData';
import { blankCell } from '@/features/attendance/lib/attendanceCell';
import { roster } from '@/features/attendance/lib/attendanceSelectors';
import type { AttendanceCell } from '@/features/attendance/types/attendanceTypes';
import { rememberZoomName } from '@/features/students/lib/studentZoomNames';
import { automaticIgnore, ignoredZoomName, splitZoomName } from './zoomNames';
import { normalizeZoomName } from '@/features/students/lib/studentZoomNames';
import { MAX_ZOOM_NAME_LENGTH, ZOOM_MATCHING_RULE } from '../const/zoomNameRules';
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
    if (automaticIgnore(row))
      throw new Error('Waiting room, host, co-host, and generic device rows must stay ignored.');
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
    const parsed = splitZoomName(row.name);
    for (const name of row.namesToSave || []) {
      if (!name.trim() || name.length > MAX_ZOOM_NAME_LENGTH || ignoredZoomName(name))
        throw new Error(
          'Choose a personal Zoom name up to 200 characters. Device and excluded names cannot be saved.',
        );
      if (
        ![parsed.displayName, parsed.originalName].some(
          (value) => normalizeZoomName(value) === normalizeZoomName(name),
        )
      )
        throw new Error('Only names shown in this report row can be approved.');
    }
  });
  if (!decisions.size) throw new Error('No matched students to import.');
  rows
    .filter((row) => row.studentId !== 'ignore')
    .forEach((row) => {
      const student = data.students.find((item) => item.id === row.studentId)!;
      for (const name of row.namesToSave || []) rememberZoomName(student, name, data.students);
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
    matchingRule: ZOOM_MATCHING_RULE,
  });
  recordEvent(data, `Imported ${filename} into ${session.date}`);
  return id;
}
