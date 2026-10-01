import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTranslation } from 'react-i18next';
import type { SessionModel } from '../hooks/useSessionAttendance';

export type SessionConfirmationDialogProps = Pick<
  SessionModel,
  'dialog' | 'setDialog' | 'confirmSessionAction' | 'error'
>;
export function SessionConfirmationDialog({
  dialog,
  setDialog,
  confirmSessionAction,
  error,
}: SessionConfirmationDialogProps) {
  const { t } = useTranslation();
  return (
    (dialog === 'finalize' || dialog === 'remove') && (
      <Dialog
        title={t(dialog === 'finalize' ? 'Finalize attendance' : 'Remove session')}
        onClose={() => setDialog(null)}
        footer={
          <Button variant="primary" onClick={confirmSessionAction}>
            {t('Confirm')}
          </Button>
        }
      >
        <p>
          {t(
            dialog === 'finalize'
              ? 'Save all current edits and finalize attendance for every student in this session.'
              : 'This session will be excluded from attendance results. Its records are preserved and it can be restored from the class page.',
          )}
        </p>
        {error && <ErrorState>{error}</ErrorState>}
      </Dialog>
    )
  );
}
