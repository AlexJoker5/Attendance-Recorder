import type { ColumnDef } from '@tanstack/react-table';
import { compareStudentNames } from '@/features/students/lib/studentNameOrder';
import type { ImportsModel } from '../hooks/useImportHistory';
type ImportChangesRow = ImportsModel['plan'][number];
export type ImportChangesTableColumnProps = Pick<ImportsModel, 't' | 'log'>;

export function createImportChangesColumns({
  t,
  log,
}: ImportChangesTableColumnProps): ColumnDef<ImportChangesRow>[] {
  if (!log) return [];
  return [
    {
      accessorKey: 'name',
      header: t('Student'),
      sortingFn: (a, b) => compareStudentNames(a.original, b.original),
    },
    { id: 'before', accessorFn: (row) => row.before.status, header: t('Before') },
    { id: 'after', accessorFn: (row) => row.after.status, header: t('After') },
    {
      id: 'undo',
      accessorFn: (row) => (row.safe ? 'Restore original' : 'Keep later changes'),
      header: t('Undo decision'),
      cell: ({ row }) =>
        t(
          log.undoneAt
            ? 'Already undone'
            : row.original.safe
              ? 'Restore original'
              : 'Keep later changes',
        ),
    },
  ];
}
