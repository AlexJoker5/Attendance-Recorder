import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { formatCreatedDate } from '@/utils/formatCreatedDate';
import type { DataTableProps } from '../types/dataTableTypes';

function recordCreatedAt(row: unknown): string | undefined {
  if (row && typeof row === 'object' && 'createdAt' in row && typeof row.createdAt === 'string') {
    return row.createdAt;
  }
}

export function withCreatedDateColumn<T>(
  columns: ColumnDef<T>[],
  {
    getCreatedAt = recordCreatedAt,
    createdDateEmptyLabel = 'Not recorded',
    createdDateDescription = 'When this record was created (Asia/Yangon).',
  }: Pick<DataTableProps<T>, 'getCreatedAt' | 'createdDateEmptyLabel' | 'createdDateDescription'>,
  t: TFunction,
  language: string,
): ColumnDef<T>[] {
  const createdDate: ColumnDef<T> = {
    id: 'createdAt',
    header: () => <span title={t(createdDateDescription)}>{t('Created Date')}</span>,
    accessorFn: (row) => {
      const formatted = formatCreatedDate(getCreatedAt(row), language);
      return formatted ? formatted.date + ' ' + formatted.time : undefined;
    },
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      Date.parse(getCreatedAt(a.original)!) - Date.parse(getCreatedAt(b.original)!),
    cell: ({ row }) => {
      const value = getCreatedAt(row.original);
      const formatted = formatCreatedDate(value, language);
      if (!formatted) return <span className="text-muted">{t(createdDateEmptyLabel)}</span>;
      return (
        <time
          dateTime={value}
          title={t(createdDateDescription) + ' ' + value}
          className="whitespace-nowrap"
        >
          {formatted.date}
          <small>{formatted.time}</small>
        </time>
      );
    },
  };
  const result = [...columns];
  const actionIndex = result.findIndex((column) => column.id === 'actions');
  result.splice(actionIndex < 0 ? result.length : actionIndex, 0, createdDate);
  return result;
}
