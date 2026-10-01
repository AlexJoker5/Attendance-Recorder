import { DataTable } from '@/components/ui/table/DataTable';
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
      getCreatedAt={(row) => row.cell.createdAt}
      createdDateDescription="When this attendance record was created (Asia/Yangon)."
      columns={createAttendanceColumns({ t, readonly, register, control })}
    />
  );
}
