import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { StudentsModel } from '../hooks/useStudentsPage';
import { createStudentsColumns } from '../tables/studentsColumns';
import { STUDENT_SEARCH_PLACEHOLDER } from '../const/studentSearch';
export type StudentsTableProps = Pick<StudentsModel, 'semester' | 'group' | 'status' | 'rows'>;
export function StudentsTable({ semester, group, status, rows }: StudentsTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      key={semester.id + group + status}
      data={rows}
      columns={createStudentsColumns({ t })}
      label={STUDENT_SEARCH_PLACEHOLDER}
      searchPlaceholder={STUDENT_SEARCH_PLACEHOLDER}
    />
  );
}
