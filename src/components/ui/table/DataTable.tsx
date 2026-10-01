import { flexRender } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DataTablePagination } from './DataTablePagination';
import { DataTableSortButton } from './DataTableSortButton';
import { DataTableToolbar } from './DataTableToolbar';
import { useDataTable } from './hooks/useDataTable';
import { withCreatedDateColumn } from './lib/createdDateColumn';
import type { DataTableProps } from './types/dataTableTypes';
export function DataTable<T>({
  data,
  columns,
  label = 'Search table',
  searchPlaceholder = 'Search table',
  getCreatedAt,
  createdDateEmptyLabel,
  createdDateDescription,
}: DataTableProps<T>) {
  const { t, i18n } = useTranslation();
  const tableColumns = withCreatedDateColumn(
    columns,
    { getCreatedAt, createdDateEmptyLabel, createdDateDescription },
    t,
    i18n.language,
  );
  const table = useDataTable({ data, columns: tableColumns });
  return (
    <div className="table-shell">
      <DataTableToolbar table={table} label={label} searchPlaceholder={searchPlaceholder} />{' '}
      <div className="table-scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    aria-sort={
                      header.column.getIsSorted() === 'asc'
                        ? 'ascending'
                        : header.column.getIsSorted() === 'desc'
                          ? 'descending'
                          : 'none'
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <DataTableSortButton header={header} table={table} />
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
            {!table.getRowModel().rows.length && (
              <tr>
                <td colSpan={table.getVisibleLeafColumns().length} className="empty">
                  {t('No matching records.')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
