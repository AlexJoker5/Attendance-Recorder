import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';

export type ClassSessionRemovalDialogProps = Pick<
  ClassDetailsModel,
  | 'sessionToRemove'
  | 'isRemovingSession'
  | 'sessionRemovalError'
  | 'cancelRemoveClassSession'
  | 'confirmRemoveClassSession'
>;
export function ClassSessionRemovalDialog({
  sessionToRemove,
  isRemovingSession,
  sessionRemovalError,
  cancelRemoveClassSession,
  confirmRemoveClassSession,
}: ClassSessionRemovalDialogProps) {
  const { t } = useTranslation();
  if (!sessionToRemove) return null;
  return (
    <Dialog
      title={t('Remove session')}
      onClose={cancelRemoveClassSession}
      busy={isRemovingSession}
      footer={
        <Button
          variant="danger"
          onClick={() => void confirmRemoveClassSession()}
          disabled={isRemovingSession}
        >
          {t(isRemovingSession ? 'Removing…' : 'Remove session')}
        </Button>
      }
    >
      <p className="mb-4">{t('Remove the session on {{date}}?', { date: sessionToRemove.date })}</p>
      <p>
        {t(
          'This session will be excluded from attendance results. Its records are preserved and it can be restored from the class page.',
        )}
      </p>
      {sessionRemovalError && <ErrorState>{t(sessionRemovalError)}</ErrorState>}
    </Dialog>
  );
}
