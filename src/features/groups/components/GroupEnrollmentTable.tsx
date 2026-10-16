import { DataTable } from '@/components/ui/table/DataTable';
import { STUDENT_SEARCH_PLACEHOLDER } from '@/features/students/const/studentSearch';
import { useTranslation } from 'react-i18next';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';
import { createGroupEnrollmentColumns } from '../tables/groupEnrollmentColumns';
export type GroupEnrollmentTableProps = Pick<
  GroupDetailsModel,
  'rows' | 'promptUnenrollSingle' | 'readonly'
>;
export function GroupEnrollmentTable({
  rows,
  promptUnenrollSingle,
  readonly,
}: GroupEnrollmentTableProps) {
  const { t } = useTranslation();
  return (
    <DataTable
      data={rows}
      columns={createGroupEnrollmentColumns({ t, promptUnenrollSingle, readonly })}
      label={STUDENT_SEARCH_PLACEHOLDER}
      searchPlaceholder={STUDENT_SEARCH_PLACEHOLDER}
    />
  );
}
