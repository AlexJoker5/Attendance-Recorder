import { readWorkbook } from '@/utils/readWorkbook';
import type { WorkbookData } from '@/utils/types/spreadsheetTypes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useWorkbookMapper({
  onReview,
}: {
  onReview: (rows: { name: string; email: string }[], file: File) => void;
}) {
  const { t } = useTranslation();
  const [book, setBook] = useState<WorkbookData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sheet, setSheet] = useState('');
  const [header, setHeader] = useState(1);
  const [nameColumn, setNameColumn] = useState(0);
  const [emailColumn, setEmailColumn] = useState(1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const rows = book?.worksheets[sheet] || [];
  const headers = rows[header - 1] || [];
  function detect(values: string[]) {
    setNameColumn(
      Math.max(
        0,
        values.findIndex((value) => /name/i.test(value)),
      ),
    );
    setEmailColumn(values.findIndex((value) => /e-?mail/i.test(value)));
  }
  const loadWorkbook = async (
    event: import('react').ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setBusy(true);
    setError('');
    setBook(null);
    try {
      const parsed = await readWorkbook(selected);
      const first = Object.keys(parsed.worksheets)[0];
      setFile(selected);
      setBook(parsed);
      setSheet(first);
      setHeader(1);
      detect(parsed.worksheets[first][0] || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not read the file.');
    } finally {
      setBusy(false);
    }
  };
  const reviewMappedRows = () => {
    setError('');
    if (nameColumn === emailColumn) {
      setError('Name and email must use different columns.');
      return;
    }
    const selected = rows
      .slice(header)
      .filter((row) => row.some((value) => value.trim()))
      .map((row) => ({
        name: row[nameColumn]?.trim() || '',
        email: emailColumn >= 0 ? (row[emailColumn] || '').trim().toLowerCase() : '',
      }));
    if (!selected.length) {
      setError('No data rows found after this header.');
      return;
    }
    onReview(selected, file!);
  };

  return {
    t,
    busy,
    loadWorkbook,
    book,
    sheet,
    setSheet,
    setHeader,
    detect,
    rows,
    header,
    nameColumn,
    setNameColumn,
    headers,
    emailColumn,
    setEmailColumn,
    reviewMappedRows,
    error,
  };
}
export type WorkbookMapperModel = NonNullable<ReturnType<typeof useWorkbookMapper>>;
