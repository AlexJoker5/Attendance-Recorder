import type { ColumnDef } from '@tanstack/react-table';
import type { StudentImportModel } from '../hooks/useStudentImport';
import type { StudentImportRow } from '../types/studentImportTypes';
export function createStudentImportColumns({
  t,
  rows,
  setRows,
}: Pick<StudentImportModel, 't' | 'rows' | 'setRows'>): ColumnDef<StudentImportRow>[] {
  return [
    {
      id: 'select',
      header: t('Import'),
      cell: ({ row }) => (
        <input
          aria-label={t('Import') + ' ' + row.original.name}
          type="checkbox"
          checked={row.original.selected}
          disabled={row.original.blocked}
          onChange={(event) =>
            setRows(
              rows.map((item) =>
                item === row.original ? { ...item, selected: event.target.checked } : item,
              ),
            )
          }
        />
      ),
    },
    { accessorKey: 'name', header: t('Student') },
    { accessorKey: 'email', header: t('Email') },
    {
      accessorKey: 'description',
      header: t('Result'),
      cell: ({ row }) => t(row.original.description),
    },
  ];
}
