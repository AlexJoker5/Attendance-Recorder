import type { SpreadsheetFormat } from '@/utils/types/spreadsheetTypes';
import type { SpreadsheetRows } from './types/spreadsheetTypes';
export async function exportSheet(
  filename: string,
  rows: SpreadsheetRows,
  format: SpreadsheetFormat,
) {
  const XLSX = await import('xlsx');
  const safe = rows.map((row) =>
    row.map((value) =>
      typeof value === 'string' && /^[\s]*[=+@-]/.test(value) ? "'" + value : value,
    ),
  );
  const book = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(safe);
  XLSX.utils.book_append_sheet(book, sheet, 'Attendance');
  XLSX.writeFile(book, filename + '.' + format, { bookType: format });
}
