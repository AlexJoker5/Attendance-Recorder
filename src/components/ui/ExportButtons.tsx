import type { SpreadsheetFormat } from '@/utils/types/spreadsheetTypes';
import { ArrowUpFromLine } from 'lucide-react';
import { Button } from './Button';
export function ExportButtons({
  onExport,
  disabled = false,
}: {
  onExport: (format: SpreadsheetFormat) => void | Promise<void>;
  disabled?: boolean;
}) {
  return (
    <>
      <Button disabled={disabled} onClick={() => void onExport('csv')}>
        <ArrowUpFromLine size={16} />
        CSV
      </Button>
      <Button disabled={disabled} onClick={() => void onExport('xlsx')}>
        <ArrowUpFromLine size={16} />
        XLSX
      </Button>
    </>
  );
}
