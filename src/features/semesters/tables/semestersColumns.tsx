import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ColumnDef } from '@tanstack/react-table';
import type { SemestersModel } from '../hooks/useSemestersPage';
type SemestersRow = SemestersModel['data']['semesters'][number];
export type SemestersTableColumnProps = Pick<
  SemestersModel,
  't' | 'setSemesterId' | 'navigate' | 'setEditing' | 'archive'
>;

export function createSemestersColumns({
  t,
  setSemesterId,
  navigate,
  setEditing,
  archive,
}: SemestersTableColumnProps): ColumnDef<SemestersRow>[] {
  return [
    { accessorKey: 'name', header: t('Semester') },
    { accessorKey: 'start', header: t('Start date') },
    { accessorKey: 'end', header: t('End date') },
    {
      id: 'state',
      accessorFn: (row) => (row.archived ? 'Archived' : 'Active'),
      header: t('Status'),
      cell: ({ row }) => <Badge>{t(row.original.archived ? 'Archived' : 'Active')}</Badge>,
    },
    {
      id: 'actions',
      header: t('Actions'),
      cell: ({ row }) => (
        <div className="actions">
          <Button
            onClick={() => {
              setSemesterId(row.original.id);
              navigate('/groups');
            }}
          >
            {t('Open semester')}
          </Button>
          <Button onClick={() => setEditing(row.original)}>{t('Edit')}</Button>
          <Button onClick={() => void archive(row.original)}>
            {t(row.original.archived ? 'Restore' : 'Archive')}
          </Button>
        </div>
      ),
    },
  ];
}
