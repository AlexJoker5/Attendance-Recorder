import { SUPPORTED_SPREADSHEET_EXTENSION } from './const/spreadsheetFormats';
import { MAX_SPREADSHEET_DATA_ROWS, MAX_SPREADSHEET_FILE_BYTES } from './const/spreadsheetLimits';
import type { WorkbookData } from './types/spreadsheetTypes';
export async function readWorkbook(file: File): Promise<WorkbookData> {
  if (!SUPPORTED_SPREADSHEET_EXTENSION.test(file.name))
    throw new Error('Choose a CSV or XLSX file.');
  if (file.size > MAX_SPREADSHEET_FILE_BYTES) throw new Error('Files must be smaller than 10 MiB.');
  const XLSX = await import('xlsx');
  const book = XLSX.read(await file.arrayBuffer(), {
    type: 'array',
    sheetRows: MAX_SPREADSHEET_DATA_ROWS + 2,
  });
  const worksheets: Record<string, string[][]> = {};
  for (const name of book.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<unknown[]>(book.Sheets[name], {
      header: 1,
      defval: '',
      raw: false,
    });
    if (rows.length > MAX_SPREADSHEET_DATA_ROWS + 1)
      throw new Error(
        'This worksheet exceeds the 5,000-row import limit. Split the report into smaller files.',
      );
    worksheets[name] = rows.map((row) => row.map((value) => String(value ?? '')));
  }
  if (!Object.values(worksheets).some((rows) => rows.length > 1))
    throw new Error('No attendance rows found in this file.');
  return { filename: file.name, worksheets };
}
