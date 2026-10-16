import { DataTable } from '@/components/ui/table/DataTable';
import { STUDENT_RESULT_SORTING } from '@/features/students/const/studentSorting';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';
import { createClassResultsColumns } from '../tables/classResultsColumns';
export type ClassResultsTableProps = Pick<ClassDetailsModel, 'results'>;
export function ClassResultsTable({ results }: ClassResultsTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      getCreatedAt={(row) => row.enrollment.createdAt}
      createdDateDescription="When this semester enrollment was created (Asia/Yangon)."
      data={results}
      initialSorting={STUDENT_RESULT_SORTING}
      columns={createClassResultsColumns({ t })}
    />
  );
}
