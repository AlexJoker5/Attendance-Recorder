import type { ColumnDef } from '@tanstack/react-table';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';
export type StudentSemesterHistoryTableDataProps = Pick<StudentDetailsModel, 'data' | 'student'>;
export type StudentSemesterHistoryTableColumnProps = Pick<StudentDetailsModel, 't'>;
export function selectStudentSemesterHistoryRows({
  data,
  student,
}: StudentSemesterHistoryTableDataProps) {
  return data.enrollments
    .filter((item) => item.studentId === student.id)
    .map((item) => ({
      ...item,
      semester: data.semesters.find((sem) => sem.id === item.semesterId)?.name,
      group: data.groups.find((group) => group.id === item.groupId)?.name,
    }));
}
export function createStudentSemesterHistoryColumns({
  t,
}: StudentSemesterHistoryTableColumnProps): ColumnDef<
  ReturnType<typeof selectStudentSemesterHistoryRows>[number]
>[] {
  return [
    { accessorKey: 'semester', header: t('Semester') },
    { accessorKey: 'group', header: t('Group') },
    { accessorKey: 'joined', header: t('Enrollment date') },
    { accessorKey: 'status', header: t('Status') },
  ];
}
