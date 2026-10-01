import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';
import { createGroupEnrollmentColumns } from '../tables/groupEnrollmentColumns';
export type GroupEnrollmentTableProps = Pick<GroupDetailsModel, 'rows'>;
export function GroupEnrollmentTable({ rows }: GroupEnrollmentTableProps) {
  const { t } = useTranslation();
  return <DataTable data={rows} columns={createGroupEnrollmentColumns({ t })} />;
}
