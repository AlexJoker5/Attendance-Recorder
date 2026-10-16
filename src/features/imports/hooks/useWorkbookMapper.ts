import { readWorkbook } from '@/utils/readWorkbook';
import type { WorkbookData } from '@/utils/types/spreadsheetTypes';
import { detectZoomReportColumns, mapZoomReport } from '@/utils/mapZoomReport';
import type { ZoomReportRow } from '../types/importTypes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useWorkbookMapper({
  onReview,
  purpose = 'students',
}: {
  onReview: (rows: ZoomReportRow[], file: File) => void;
  purpose?: 'students' | 'attendance';
}) {
  const { t } = useTranslation();
  const [book, setBook] = useState<WorkbookData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sheet, setSheet] = useState('');
  const [header, setHeader] = useState(1);
  const [nameColumn, setNameColumn] = useState(0);
  const [emailColumn, setEmailColumn] = useState(1);
  const [waitingRoomColumn, setWaitingRoomColumn] = useState(-1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const rows = book?.worksheets[sheet] || [];
  const headers = rows[header - 1] || [];
  function detect(values: string[]) {
    if (purpose === 'attendance') {
      const columns = detectZoomReportColumns(values);
      setNameColumn(columns.nameColumn);
      setEmailColumn(columns.emailColumn);
      setWaitingRoomColumn(columns.waitingRoomColumn);
      return;
    }
    const nonHostNameIndex = values.findIndex(
      (value) => !/host/i.test(value) && /name/i.test(value),
    );
    setNameColumn(
      nonHostNameIndex >= 0
        ? nonHostNameIndex
        : Math.max(
            0,
            values.findIndex((value) => /name/i.test(value)),
          ),
    );
    const nonHostEmailIndex = values.findIndex(
      (value) => !/host/i.test(value) && /e-?mail/i.test(value),
    );
    setEmailColumn(
      nonHostEmailIndex >= 0
        ? nonHostEmailIndex
        : values.findIndex((value) => /e-?mail/i.test(value)),
    );
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
    if (purpose === 'students' && nameColumn === emailColumn) {
      setError('Name and email must use different columns.');
      return;
    }
    if (!Number.isInteger(header) || header < 1 || header >= rows.length || !headers[nameColumn]) {
      setError('Choose a valid header row and name column.');
      return;
    }
    if (purpose === 'attendance') {
      if (waitingRoomColumn === nameColumn) {
        setError('Name and waiting room must use different columns.');
        return;
      }
      const selected = mapZoomReport(
        rows.slice(header),
        headers,
        nameColumn,
        -1,
        waitingRoomColumn,
        header + 1,
      );
      if (!selected.length) {
        setError('No data rows found after this header.');
        return;
      }
      onReview(selected, file!);
      return;
    }
    const selected = rows
      .slice(header)
      .filter((row) => row.some((value) => value.trim()))
      .map((row) => ({
        name: row[nameColumn]?.trim() || '',
        email: emailColumn >= 0 ? (row[emailColumn] || '').trim().toLowerCase() : '',
      }))
      .filter((row) => row.name || row.email);

    if (!selected.length) {
      setError('No data rows found after this header.');
      return;
    }
    const combinedMap = new Map<string, { name: string; email: string; rejoins: number }>();
    for (const item of selected) {
      const key = `${item.name.toLowerCase()}__${item.email.toLowerCase()}`;
      const prior = combinedMap.get(key);
      if (prior) {
        prior.rejoins++;
      } else {
        combinedMap.set(key, { name: item.name, email: item.email, rejoins: 1 });
      }
    }
    onReview(Array.from(combinedMap.values()), file!);
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
    waitingRoomColumn,
    setWaitingRoomColumn,
    purpose,
    reviewMappedRows,
    error,
  };
}
export type WorkbookMapperModel = NonNullable<ReturnType<typeof useWorkbookMapper>>;
