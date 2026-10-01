import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';
import type { ImportsModel } from '../hooks/useImportHistory';
type ImportHistoryRow = ImportsModel['rows'][number];
export type ImportHistoryTableColumnProps = Pick<ImportsModel, 't' | 'setSelected' | 'setError'>;

export function createImportHistoryColumns({
  t,
  setSelected,
  setError,
}: ImportHistoryTableColumnProps): ColumnDef<ImportHistoryRow>[] {
  return [
    { accessorKey: 'filename', header: t('Report') },
    {
      accessorKey: 'destination',
      header: t('Destination'),
      cell: ({ row }) => (
        <Link to={'/sessions/' + row.original.sessionId}>{row.original.destination}</Link>
      ),
    },
    { accessorKey: 'count', header: t('Matched students') },
    {
      id: 'status',
      accessorFn: (row) => (row.undoneAt ? 'Undone' : 'Applied'),
      header: t('Status'),
      cell: ({ row }) => <Badge>{t(row.original.undoneAt ? 'Undone' : 'Applied')}</Badge>,
    },
    {
      id: 'actions',
      header: t('Actions'),
      cell: ({ row }) => (
        <Button
          onClick={() => {
            setSelected(row.original.id);
            setError('');
          }}
        >
          {t('View changes')}
        </Button>
      ),
    },
  ];
}
