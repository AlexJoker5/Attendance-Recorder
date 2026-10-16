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
    namesReady,
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
          'Attendance matches registered and approved Zoom names only. Review close names and approve additional names before applying. Email is not used.',
        )}
      </p>
      {!namesReady && (
        <p className="callout warning mb-6">
          {t(
            'Install supabase/009_zoom_name_matching.sql before importing attendance or saving Zoom names.',
          )}
        </p>
      )}
      {namesReady && (
        <ImportWorkbookPanel
          readonly={readonly}
          reviewWorkbook={reviewWorkbook}
          students={students}
        />
      )}
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
        readonly={readonly || !namesReady}
        busy={busy}
        applyReviewedImport={applyReviewedImport}
      />
    </>
  );
}
