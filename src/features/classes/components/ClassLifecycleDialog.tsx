import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';

export type ClassLifecycleDialogProps = Pick<
  ClassDetailsModel,
  'dialog' | 'setDialog' | 'confirmClassAction'
>;
export function ClassLifecycleDialog({
  dialog,
  setDialog,
  confirmClassAction,
}: ClassLifecycleDialogProps) {
  const { t } = useTranslation();
  return (
    (dialog === 'archive' || dialog === 'complete') && (
      <Dialog
        title={t('Confirm changes')}
        onClose={() => setDialog(null)}
        footer={
          <Button variant="primary" onClick={confirmClassAction}>
            {t('Confirm')}
          </Button>
        }
      >
        <p>
          {t(
            dialog === 'complete'
              ? 'Class completion determines final attendance results. Reopening restores provisional results.'
              : 'Linked attendance will be preserved when archiving.',
          )}
        </p>
      </Dialog>
    )
  );
}
