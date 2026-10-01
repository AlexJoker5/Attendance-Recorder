import { PageHeading } from '@/components/ui/PageHeading';
import { useTranslation } from 'react-i18next';
import { ImportReviewPanel } from '../components/ImportReviewPanel';
import { ImportWorkbookPanel } from '../components/ImportWorkbookPanel';
import { useImportReview } from '../hooks/useImportReview';
export default function ImportSessionPage() {
  const model = useImportReview();
  const { t } = useTranslation();
  if (!model) return <p>{t('Session not found.')}</p>;
  const {
    group,
    cls,
    session,
    semester,
    readonly,
    reviewWorkbook,
    students,
    rows,
    file,
    filter,
    setFilter,
    data,
    update,
    error,
    busy,
    applyReviewedImport,
  } = model;
  return (
    <>
      <PageHeading
        title={t('Import Zoom report')}
        description={`${group.name} · ${cls.name} · ${session.date}`}
      />
      <p className="callout mb-6">
        <strong>
          {t('Import destination')}: {semester.name} / {group.name} / {cls.name} / {session.date}
        </strong>
        <br />
        {t(
          'Email is the only automatic match. Missing or unknown emails require manual selection or Ignore.',
        )}
      </p>
      <ImportWorkbookPanel
        readonly={readonly}
        reviewWorkbook={reviewWorkbook}
        students={students}
      />
      <ImportReviewPanel
        rows={rows}
        file={file}
        filter={filter}
        setFilter={setFilter}
        data={data}
        session={session}
        update={update}
        students={students}
        error={error}
        readonly={readonly}
        busy={busy}
        applyReviewedImport={applyReviewedImport}
      />
    </>
  );
}
