import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { SemestersModel } from '../hooks/useSemestersPage';
import { createSemestersColumns } from '../tables/semestersColumns';
export type SemestersTableProps = Pick<
  SemestersModel,
  'data' | 'setSemesterId' | 'navigate' | 'setEditing' | 'archive'
>;
export function SemestersTable({
  data,
  setSemesterId,
  navigate,
  setEditing,
  archive,
}: SemestersTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      data={data.semesters}
      columns={createSemestersColumns({ t, setSemesterId, navigate, setEditing, archive })}
    />
  );
}
