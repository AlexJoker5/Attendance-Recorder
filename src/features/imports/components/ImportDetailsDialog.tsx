import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { localMode } from '@/lib/supabase';
import { ArrowUpFromLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ImportsModel } from '../hooks/useImportHistory';
import { ImportChangesTable } from './ImportChangesTable';

export type ImportDetailsDialogProps = Pick<
  ImportsModel,
  | 'log'
  | 'setSelected'
  | 'plan'
  | 'downloadSelectedOriginal'
  | 'semester'
  | 'undoSelectedImport'
  | 'error'
>;
export function ImportDetailsDialog({
  log,
  setSelected,
  plan,
  downloadSelectedOriginal,
  semester,
  undoSelectedImport,
  error,
}: ImportDetailsDialogProps) {
  const { t } = useTranslation();
  return (
    log && (
      <Dialog title={t('Import details')} onClose={() => setSelected('')}>
        <p className="mb-5">{log.filename}</p>
        <p className="callout mb-5">
          {t(
            'Undo restores only cells still owned by this import. Later edits and imports are preserved. Verified emails remain saved. Restored attendance returns to Draft.',
          )}
        </p>
        <ImportChangesTable plan={plan} log={log} />
        {log.summary && (
          <p className="mt-5">
            {log.summary.restored} {t('restored')} · {log.summary.preserved} {t('preserved')}
          </p>
        )}
        <div className="actions mt-6">
          <Button onClick={downloadSelectedOriginal}>
            <ArrowUpFromLine size={16} />
            {t('Download original')}
          </Button>
          <Button
            variant="danger"
            disabled={semester.archived || !!log.undoneAt}
            onClick={undoSelectedImport}
          >
            {t('Undo eligible changes')}
          </Button>
        </div>
        <p className="muted mt-5">
          {t(
            localMode
              ? 'Originals are stored in this browser for the local preview.'
              : 'Original reports are stored privately in Supabase. Undo keeps the original file.',
          )}
        </p>
        {error && <ErrorState>{error}</ErrorState>}
      </Dialog>
    )
  );
}
