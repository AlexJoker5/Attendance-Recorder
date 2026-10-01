import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageHeading } from '@/components/ui/PageHeading';
import { ImportDetailsDialog } from '../components/ImportDetailsDialog';
import { ImportHistoryFilters } from '../components/ImportHistoryFilters';
import { ImportHistoryPanel } from '../components/ImportHistoryPanel';
import { useImportHistory } from '../hooks/useImportHistory';
export default function ImportsPage() {
  const model = useImportHistory();

  if (!model) return null;
  const {
    t,
    filter,
    setFilter,
    rows,
    setSelected,
    setError,
    log,
    plan,
    downloadSelectedOriginal,
    semester,
    undoSelectedImport,
    error,
  } = model;
  return (
    <>
      <PageHeading
        title={t('Import history')}
        description={t(
          'Import from the class session for the correct date. Review changes and undo eligible attendance updates here.',
        )}
        actions={
          <ButtonLink className="primary" to="/groups">
            {t('Choose class and session')}
          </ButtonLink>
        }
      />
      <ImportHistoryFilters filter={filter} setFilter={setFilter} />
      <ImportHistoryPanel
        filter={filter}
        rows={rows}
        setSelected={setSelected}
        setError={setError}
      />
      <ImportDetailsDialog
        log={log}
        setSelected={setSelected}
        plan={plan}
        downloadSelectedOriginal={downloadSelectedOriginal}
        semester={semester}
        undoSelectedImport={undoSelectedImport}
        error={error}
      />
    </>
  );
}
