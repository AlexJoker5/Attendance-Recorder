import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { DEFAULT_TABLE_PAGE_SIZE } from '../const/tableDefaults';
import type { DataTableProps } from '../types/dataTableTypes';
export function useDataTable<T>({ data, columns }: Pick<DataTableProps<T>, 'data' | 'columns'>) {
  const [filter, setFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  return useReactTable({
    data,
    columns,
    state: { globalFilter: filter, sorting },
    onGlobalFilterChange: setFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: DEFAULT_TABLE_PAGE_SIZE } },
  });
}
