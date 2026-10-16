import { DataTable } from '@/components/ui/table/DataTable';
import { IMPORT_REVIEW_SORTING } from '../const/importReviewSorting';
import { useTranslation } from 'react-i18next';
import type { ImportSessionModel } from '../hooks/useImportReview';
import { createImportReviewColumns, selectImportReviewRows } from '../tables/importReviewColumns';
export type ImportReviewTableProps = Pick<
  ImportSessionModel,
  'filter' | 'rows' | 'data' | 'session' | 'update' | 'students'
>;
export function ImportReviewTable({
  filter,
  rows,
  data,
  session,
  update,
  students,
}: ImportReviewTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      key={filter}
      initialSorting={IMPORT_REVIEW_SORTING}
      createdDateEmptyLabel="Not saved yet"
      data={selectImportReviewRows({ rows, filter })}
      columns={createImportReviewColumns({ t, data, session, update, students })}
    />
  );
}
