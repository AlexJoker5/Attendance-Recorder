import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { useWorkbookMapper } from '../hooks/useWorkbookMapper';
import { WorkbookFileInput } from './WorkbookFileInput';
import { WorkbookMappingFields } from './WorkbookMappingFields';
export function WorkbookMapper(props: Parameters<typeof useWorkbookMapper>[0]) {
  const model = useWorkbookMapper(props);
  if (!model) return null;
  const {
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
  } = model;
  return (
    <div className="form-stack">
      <WorkbookFileInput busy={busy} loadWorkbook={loadWorkbook} />
      {busy && <p role="status">{t('Reading spreadsheet…')}</p>}
      {book && (
        <>
          <p className="muted">{book.filename}</p>
          <WorkbookMappingFields
            sheet={sheet}
            setSheet={setSheet}
            setHeader={setHeader}
            detect={detect}
            book={book}
            rows={rows}
            header={header}
            nameColumn={nameColumn}
            setNameColumn={setNameColumn}
            headers={headers}
            emailColumn={emailColumn}
            setEmailColumn={setEmailColumn}
          />
          <Button variant="primary" onClick={reviewMappedRows}>
            {t('Review matches')}
          </Button>
        </>
      )}
      {error && <ErrorState>{t(error)}</ErrorState>}
    </div>
  );
}
