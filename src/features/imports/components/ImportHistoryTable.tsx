import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { ImportsModel } from '../hooks/useImportHistory';
import { createImportHistoryColumns } from '../tables/importHistoryColumns';
export type ImportHistoryTableProps = Pick<
  ImportsModel,
  'filter' | 'rows' | 'setSelected' | 'setError'
>;
export function ImportHistoryTable({
  filter,
  rows,
  setSelected,
  setError,
}: ImportHistoryTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      key={filter}
      data={rows}
      getCreatedAt={(row) => row.at}
      createdDateDescription="When this import was applied (Asia/Yangon)."
      columns={createImportHistoryColumns({ t, setSelected, setError })}
    />
  );
}
