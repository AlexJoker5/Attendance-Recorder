import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDownToLine, Trash2 } from 'lucide-react';
import { WEEKDAYS as weekdays } from '../const/scheduleDefaults';
import type { ClassDetailsModel } from '../hooks/useClassDetails';
type ClassSessionsRow = ClassDetailsModel['rows'][number];
export type ClassSessionsTableColumnProps = Pick<
  ClassDetailsModel,
  't' | 'readonly' | 'restoreClassSession' | 'requestRemoveClassSession' | 'isRemovingSession'
>;

export function createClassSessionsColumns({
  t,
  readonly,
  restoreClassSession,
  requestRemoveClassSession,
  isRemovingSession,
}: ClassSessionsTableColumnProps): ColumnDef<ClassSessionsRow>[] {
  return [
    {
      id: 'sessionName',
      accessorFn: (row) =>
        row.extra
          ? t('Extra session')
          : row.weekNumber === null
            ? t('Removed session')
            : t('Week {{number}}', { number: row.weekNumber }),
      header: t('Session name'),
      sortingFn: (a, b) => {
        const aWeek = a.original.weekNumber;
        const bWeek = b.original.weekNumber;
        if (aWeek !== null && bWeek !== null) return aWeek - bWeek;
        if (aWeek !== null) return -1;
        if (bWeek !== null) return 1;
        return a.original.date.localeCompare(b.original.date);
      },
    },
    { accessorKey: 'date', header: t('Session date') },
    {
      id: 'weekday',
      accessorFn: (row) => weekdays[new Date(row.date + 'T00:00:00Z').getUTCDay()],
      header: t('Day'),
    },
    {
      id: 'type',
      accessorFn: (row) => (row.extra ? 'Extra — excluded' : 'Regular'),
      header: t('Type'),
      cell: ({ row }) => <Badge>{t(row.original.extra ? 'Extra — excluded' : 'Regular')}</Badge>,
    },
    {
      id: 'review',
      accessorFn: (row) => (row.removed ? 'Removed' : row.finalized ? 'Finalized' : 'Draft'),
      header: t('Review status'),
      cell: ({ getValue }) => t(String(getValue())),
    },
    {
      id: 'actions',
      header: t('Actions'),
      cell: ({ row }) => (
        <div className="actions">
          <ButtonLink to={'/sessions/' + row.original.id}>{t('Open session')}</ButtonLink>
          {!row.original.removed && !readonly && (
            <ButtonLink to={'/imports/' + row.original.id}>
              <ArrowDownToLine size={16} />
              {t('Import report')}
            </ButtonLink>
          )}
          {!row.original.removed && (
            <Button
              variant="danger"
              disabled={readonly || isRemovingSession}
              aria-label={t('Remove session on {{date}}', { date: row.original.date })}
              onClick={() => requestRemoveClassSession(row.original.id)}
            >
              <Trash2 size={16} aria-hidden="true" />
              {t('Remove session')}
            </Button>
          )}
          {row.original.removed && (
            <Button disabled={readonly} onClick={() => void restoreClassSession(row.original.id)}>
              {t('Restore')}
            </Button>
          )}
        </div>
      ),
    },
  ];
}
