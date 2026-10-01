import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import type { ColumnDef } from '@tanstack/react-table';
import type { StudentsModel } from '../hooks/useStudentsPage';
type StudentsRow = StudentsModel['rows'][number];
export type StudentsTableColumnProps = Pick<StudentsModel, 't'>;

export function createStudentsColumns({ t }: StudentsTableColumnProps): ColumnDef<StudentsRow>[] {
  return [
    {
      accessorKey: 'name',
      header: t('Student'),
      cell: ({ row }) => (
        <>
          <strong>{row.original.name}</strong>
          <small>{row.original.email}</small>
        </>
      ),
    },
    { accessorKey: 'group', header: t('Group') },
    { accessorKey: 'joined', header: t('Enrollment date') },
    {
      accessorKey: 'status',
      header: t('Status'),
      cell: ({ row }) => (
        <Badge
          tone={['withdrawn', 'transferred'].includes(row.original.status) ? 'danger' : 'neutral'}
        >
          {t(row.original.status)}
        </Badge>
      ),
    },
    {
      id: 'details',
      header: t('Actions'),
      cell: ({ row }) => (
        <ButtonLink to={'/students/' + row.original.id}>{t('Go to details')}</ButtonLink>
      ),
    },
  ];
}
