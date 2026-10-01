import type { ColumnDef } from '@tanstack/react-table';
export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  label?: string;
  searchPlaceholder?: string;
  getCreatedAt?: (row: T) => string | undefined;
  createdDateEmptyLabel?: string;
  createdDateDescription?: string;
}
