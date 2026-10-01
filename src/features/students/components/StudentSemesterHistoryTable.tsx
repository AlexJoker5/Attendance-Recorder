import { DataTable } from '@/components/ui/table/DataTable';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';
import {
  createStudentSemesterHistoryColumns,
  selectStudentSemesterHistoryRows,
} from '../tables/studentSemesterHistoryColumns';
export type StudentSemesterHistoryTableProps = Pick<StudentDetailsModel, 'data' | 'student'>;
export function StudentSemesterHistoryTable({ data, student }: StudentSemesterHistoryTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      data={selectStudentSemesterHistoryRows({ data, student })}
      columns={createStudentSemesterHistoryColumns({ t })}
    />
  );
}
