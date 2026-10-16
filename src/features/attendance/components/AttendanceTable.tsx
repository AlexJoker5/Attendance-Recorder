import { DataTable } from '@/components/ui/table/DataTable';
import { STUDENT_NAME_SORTING } from '@/features/students/const/studentSorting';
import { useTranslation } from 'react-i18next';
import type { SessionModel } from '../hooks/useSessionAttendance';
import { createAttendanceColumns } from '../tables/attendanceColumns';
export type AttendanceTableProps = Pick<
  SessionModel,
  'filter' | 'source' | 'students' | 'readonly' | 'register' | 'control'
>;
export function AttendanceTable({
  filter,
  source,
  students,
  readonly,
  register,
  control,
}: AttendanceTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      key={filter + source}
      data={students}
      initialSorting={STUDENT_NAME_SORTING}
      getCreatedAt={(row) => row.cell.createdAt}
      createdDateDescription="When this attendance record was created (Asia/Yangon)."
      columns={createAttendanceColumns({ t, readonly, register, control })}
    />
  );
}
