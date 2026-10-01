import { ButtonLink } from '@/components/ui/ButtonLink';
import type { ColumnDef } from '@tanstack/react-table';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';
type GroupEnrollmentRow = GroupDetailsModel['rows'][number];
export type GroupEnrollmentTableColumnProps = Pick<GroupDetailsModel, 't'>;

export function createGroupEnrollmentColumns({
  t,
}: GroupEnrollmentTableColumnProps): ColumnDef<GroupEnrollmentRow>[] {
  return [
    { id: 'name', accessorFn: (row) => row.student.name, header: t('Student') },
    { id: 'email', accessorFn: (row) => row.student.email, header: t('Email') },
    { accessorKey: 'joined', header: t('Enrollment date') },
    { accessorKey: 'status', header: t('Status') },
    {
      id: 'details',
      header: t('Actions'),
      cell: ({ row }) => (
        <ButtonLink to={'/students/' + row.original.studentId}>{t('Go to details')}</ButtonLink>
      ),
    },
  ];
}
