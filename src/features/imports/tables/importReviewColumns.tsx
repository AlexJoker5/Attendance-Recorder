import { Badge } from '@/components/ui/Badge';
import type { ColumnDef } from '@tanstack/react-table';
import type { ImportSessionModel } from '../hooks/useImportReview';
import { ImportRowResolution } from '../components/ImportRowResolution';

export type ImportReviewTableDataProps = Pick<ImportSessionModel, 'rows' | 'filter'>;
export type ImportReviewTableColumnProps = Pick<
  ImportSessionModel,
  't' | 'data' | 'session' | 'update' | 'students'
>;
export function selectImportReviewRows({ rows, filter }: ImportReviewTableDataProps) {
  return rows.filter(
    (row) =>
      filter === 'all' ||
      (filter === 'unresolved'
        ? !row.studentId
        : filter === 'ignored'
          ? row.studentId === 'ignore'
          : !!row.studentId && row.studentId !== 'ignore'),
  );
}
export function createImportReviewColumns(
  props: ImportReviewTableColumnProps,
): ColumnDef<ReturnType<typeof selectImportReviewRows>[number]>[] {
  const { t } = props;
  return [
    {
      accessorKey: 'name',
      header: t('Zoom attendee'),
      cell: ({ row }) => (
        <>
          <strong>{row.original.displayName || row.original.name || t('Unnamed attendee')}</strong>
          {row.original.originalName && (
            <small>
              {t('Original Zoom name')}: {row.original.originalName}
            </small>
          )}
          <small>
            {t('Report row')} {row.original.sourceRow ?? row.index + 1}
          </small>
        </>
      ),
    },
    {
      id: 'description',
      accessorFn: (row) => row.description,
      header: t('Match status'),
      cell: ({ row }) => (
        <>
          <Badge tone={row.original.studentId ? 'neutral' : 'warning'}>
            {t(
              row.original.studentId === 'ignore'
                ? 'Ignored'
                : row.original.studentId
                  ? 'Matched'
                  : 'Needs review',
            )}
          </Badge>
          <small>{t(row.original.description)}</small>
        </>
      ),
    },
    {
      id: 'resolution',
      header: t('Resolution'),
      cell: ({ row }) => <ImportRowResolution {...props} item={row.original} />,
    },
  ];
}
