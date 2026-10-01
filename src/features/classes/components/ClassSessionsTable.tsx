import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';
import { createClassSessionsColumns } from '../tables/classSessionsColumns';
export type ClassSessionsTableProps = Pick<
  ClassDetailsModel,
  | 'restoreClassSession'
  | 'requestRemoveClassSession'
  | 'isRemovingSession'
  | 'state'
  | 'type'
  | 'from'
  | 'to'
  | 'rows'
  | 'readonly'
>;
export function ClassSessionsTable({
  restoreClassSession,
  requestRemoveClassSession,
  isRemovingSession,
  state,
  type,
  from,
  to,
  rows,
  readonly,
}: ClassSessionsTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      key={state + type + from + to}
      data={rows}
      columns={createClassSessionsColumns({
        t,
        readonly,
        restoreClassSession,
        requestRemoveClassSession,
        isRemovingSession,
      })}
    />
  );
}
