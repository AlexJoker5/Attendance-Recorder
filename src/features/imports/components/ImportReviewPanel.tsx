import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { IMPORT_REVIEW_FILTERS } from '../const/importDefaults';
import type { ImportSessionModel } from '../hooks/useImportReview';
import { ImportReviewTable } from './ImportReviewTable';

export type ImportReviewPanelProps = Pick<
  ImportSessionModel,
  | 'rows'
  | 'file'
  | 'filter'
  | 'setFilter'
  | 'data'
  | 'session'
  | 'update'
  | 'students'
  | 'error'
  | 'readonly'
  | 'busy'
  | 'applyReviewedImport'
>;
export function ImportReviewPanel({
  rows,
  file,
  filter,
  setFilter,
  data,
  session,
  update,
  students,
  error,
  readonly,
  busy,
  applyReviewedImport,
}: ImportReviewPanelProps) {
  const { t } = useTranslation();
  return (
    rows.length > 0 && (
      <Panel className="mt-6" title={t('Review matches')}>
        <p className="muted mb-5">
          {file?.name} · {rows.length} {t('attendee rows')}
        </p>
        <div className="filter-bar">
          <Select
            aria-label={t('Match review')}
            value={filter}
            onValueChange={(value) => setFilter(value)}
            options={IMPORT_REVIEW_FILTERS.map((value) => ({ value: value, label: t(value) }))}
          />
        </div>
        <ImportReviewTable
          filter={filter}
          rows={rows}
          data={data}
          session={session}
          update={update}
          students={students}
        />
        {error && (
          <p className="error mt-4" role="alert">
            {error}
          </p>
        )}
        <div className="actions mt-6">
          <Button variant="primary" disabled={readonly || busy} onClick={applyReviewedImport}>
            {t(busy ? 'Saving…' : 'Apply attendance')}
          </Button>
        </div>
      </Panel>
    )
  );
}
