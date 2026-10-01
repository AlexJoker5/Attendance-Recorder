import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { StudentImportModel } from '../hooks/useStudentImport';
import { createStudentImportColumns } from '../tables/studentImportColumns';
export function StudentImportTable({
  rows,
  setRows,
}: Pick<StudentImportModel, 'rows' | 'setRows'>) {
  const { t } = useTranslation();
  return (
    <DataTable
      createdDateEmptyLabel="Not saved yet"
      data={rows}
      columns={createStudentImportColumns({ t, rows, setRows })}
    />
  );
}
