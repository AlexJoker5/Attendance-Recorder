import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { ImportsModel } from '../hooks/useImportHistory';
import { createImportChangesColumns } from '../tables/importChangesColumns';
export type ImportChangesTableProps = Pick<ImportsModel, 'plan' | 'log'>;
export function ImportChangesTable({ plan, log }: ImportChangesTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      getCreatedAt={() => log?.at}
      createdDateDescription="When this import was applied (Asia/Yangon)."
      data={plan}
      columns={createImportChangesColumns({ t, log })}
    />
  );
}
