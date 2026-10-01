import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { StudentsModel } from '../hooks/useStudentsPage';
import { createStudentsColumns } from '../tables/studentsColumns';
export type StudentsTableProps = Pick<StudentsModel, 'semester' | 'group' | 'status' | 'rows'>;
export function StudentsTable({ semester, group, status, rows }: StudentsTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      key={semester.id + group + status}
      data={rows}
      columns={createStudentsColumns({ t })}
    />
  );
}
