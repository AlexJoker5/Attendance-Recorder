import type { ColumnDef, SortingState } from '@tanstack/react-table';
export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  initialSorting?: SortingState;
  label?: string;
  searchPlaceholder?: string;
  showCreatedDate?: boolean;
  getCreatedAt?: (row: T) => string | undefined;
  createdDateEmptyLabel?: string;
  createdDateDescription?: string;
}
