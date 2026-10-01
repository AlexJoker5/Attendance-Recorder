import { SPREADSHEET_FORMATS } from '../const/spreadsheetFormats';
export interface WorkbookData {
  filename: string;
  worksheets: Record<string, string[][]>;
}
export type SpreadsheetFormat = (typeof SPREADSHEET_FORMATS)[number];
export type SpreadsheetRows = (string | number)[][];
