import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Input } from '../Input';
export function DataTableToolbar<T>({
  table,
  label,
  searchPlaceholder,
}: {
  table: Table<T>;
  label: string;
  searchPlaceholder: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="table-tools">
      <Input
        type="search"
        aria-label={t(label)}
        placeholder={t(searchPlaceholder)}
        value={String(table.getState().globalFilter ?? '')}
        onChange={(event) => {
          table.setGlobalFilter(event.target.value);
          table.setPageIndex(0);
        }}
      />
      <span className="muted">
        {table.getFilteredRowModel().rows.length} {t('records')}
      </span>
    </div>
  );
}
