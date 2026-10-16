import { DataTable } from '@/components/ui/table/DataTable';
import { STUDENT_RESULT_SORTING } from '@/features/students/const/studentSorting';
import { useTranslation } from 'react-i18next';
import type { ReportsModel } from '../hooks/useAttendanceReports';
import { createAttendanceResultsColumns } from '../tables/attendanceResultsColumns';
export type AttendanceResultsTableProps = Pick<
  ReportsModel,
  'group' | 'cls' | 'result' | 'semester' | 'rows'
>;
export function AttendanceResultsTable({
  group,
  cls,
  result,
  semester,
  rows,
}: AttendanceResultsTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      key={group + cls + result + semester.id}
      data={rows}
      initialSorting={STUDENT_RESULT_SORTING}
      getCreatedAt={(row) => row.enrollment.createdAt}
      createdDateDescription="When this semester enrollment was created (Asia/Yangon)."
      columns={createAttendanceResultsColumns({ t })}
    />
  );
}
