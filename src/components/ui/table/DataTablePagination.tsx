import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { Select } from '../Select';
import { TABLE_PAGE_SIZES } from './const/tableDefaults';
export function DataTablePagination<T>({ table }: { table: Table<T> }) {
  const { t } = useTranslation();
  return (
    <footer className="table-footer">
      <label className="actions">
        {t('Rows per page')}
        <Select
          aria-label={t('Rows per page')}
          value={table.getState().pagination.pageSize}
          onValueChange={(value) => table.setPageSize(Number(value))}
          options={TABLE_PAGE_SIZES.map((size) => ({ value: size, label: size }))}
        />
      </label>
      <div className="actions">
        <span>
          {t('Page')} {table.getPageCount() ? table.getState().pagination.pageIndex + 1 : 0} /{' '}
          {table.getPageCount()}
        </span>
        <Button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
          {t('Previous')}
        </Button>
        <Button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
          {t('Next')}
        </Button>
      </div>
    </footer>
  );
}
