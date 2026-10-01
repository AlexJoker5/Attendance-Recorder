import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';
import { createStudentResultsColumns } from '../tables/studentResultsColumns';
export type StudentResultsTableProps = Pick<StudentDetailsModel, 'rows'>;
export function StudentResultsTable({ rows }: StudentResultsTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      getCreatedAt={(row) => row.enrollment.createdAt}
      createdDateDescription="When this semester enrollment was created (Asia/Yangon)."
      data={rows}
      columns={createStudentResultsColumns({ t })}
    />
  );
}
