import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { blankCell } from '@/features/attendance/lib/attendanceCell';
import { roster } from '@/features/attendance/lib/attendanceSelectors';
import { exportSheet } from '@/utils/exportSheet';
import type { SpreadsheetFormat } from '@/utils/types/spreadsheetTypes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reportRows } from '../lib/reportRows';
export function useAttendanceReports() {
  const { t } = useTranslation();
  const { data } = useAppData();
  const { semesterId } = useWorkspace();
  const [group, setGroup] = useState('all');
  const [cls, setClass] = useState('all');
  const [result, setResult] = useState('all');
  const [matrixClass, setMatrixClass] = useState('');
  const [error, setError] = useState('');
  if (!data) return null;
  const semester = selectedSemester(data, semesterId);
  const groups = data.groups.filter((item) => item.semesterId === semester.id);
  const classes = data.classes.filter((item) => groups.some((group) => group.id === item.groupId));
  const rows = reportRows(data, semester.id).filter(
    (row) =>
      (group === 'all' || row.group.id === group) &&
      (cls === 'all' || row.cls.id === cls) &&
      (result === 'all' || row.label === result),
  );
  async function exportResults(format: SpreadsheetFormat) {
    try {
      await exportSheet(
        semester.name + '-results',
        [
          [
            'Semester',
            'Student',
            'Email',
            'Group',
            'Class',
            'Present',
            'Absent',
            'Leave',
            'Pre-enrollment credit',
            'Counted sessions',
            'Attendance %',
            'Result',
            'Reasons',
          ],
          ...rows.map((row) => [
            semester.name,
            row.student.name,
            row.student.email,
            row.group.name,
            row.cls.name,
            row.present,
            row.absent,
            row.leaves,
            row.credits,
            row.total,
            row.percentage === null ? '' : Number(row.percentage.toFixed(1)),
            row.label,
            row.reasons.join('; '),
          ]),
        ],
        format,
      );
    } catch (reason) {
      setError(String(reason));
    }
  }
  async function exportMatrix(format: SpreadsheetFormat) {
    try {
      const selected = classes.find((item) => item.id === (matrixClass || classes[0]?.id));
      if (!selected) throw new Error('Choose a class first.');
      const sessions = data!.sessions
        .filter((session) => session.classId === selected.id && !session.removed && !session.extra)
        .sort((a, b) => a.date.localeCompare(b.date));
      const rows = roster(data!, selected.id).map((enrollment) => {
        const student = data!.students.find((item) => item.id === enrollment.studentId)!;
        return [
          student.name,
          student.email,
          ...sessions.map((session) => {
            const cell = session.attendance[student.id] || blankCell();
            return cell.status + (cell.remark ? ' — ' + cell.remark : '');
          }),
        ];
      });
      await exportSheet(
        selected.name + '-attendance-matrix',
        [
          [
            'Student',
            'Email',
            ...sessions.map(
              (session) =>
                session.date + (session.finalized ? '' : ' (Draft — excluded from results)'),
            ),
          ],
          ...rows,
        ],
        format,
      );
    } catch (reason) {
      setError(String(reason));
    }
  }

  return {
    t,
    exportResults,
    error,
    group,
    setGroup,
    setClass,
    groups,
    cls,
    classes,
    result,
    setResult,
    semester,
    rows,
    matrixClass,
    setMatrixClass,
    exportMatrix,
  };
}
export type ReportsModel = NonNullable<ReturnType<typeof useAttendanceReports>>;
