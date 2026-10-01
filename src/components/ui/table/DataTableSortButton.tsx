import { flexRender, type Header, type Table } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
export function DataTableSortButton<T>({
  header,
  table,
}: {
  header: Header<T, unknown>;
  table: Table<T>;
}) {
  return (
    <button
      type="button"
      className="sort-button"
      onClick={() => {
        header.column.toggleSorting();
        table.setPageIndex(0);
      }}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {header.column.getIsSorted() === 'asc' ? (
        <ArrowUp size={14} />
      ) : header.column.getIsSorted() === 'desc' ? (
        <ArrowDown size={14} />
      ) : (
        <ArrowUpDown size={14} />
      )}
    </button>
  );
}
