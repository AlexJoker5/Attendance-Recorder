import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTranslation } from 'react-i18next';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';

export type GroupLifecycleDialogProps = Pick<
  GroupDetailsModel,
  'dialog' | 'group' | 'linked' | 'setDialog' | 'confirmGroupAction' | 'error'
>;
export function GroupLifecycleDialog({
  dialog,
  group,
  linked,
  setDialog,
  confirmGroupAction,
  error,
}: GroupLifecycleDialogProps) {
  const { t } = useTranslation();
  return (
    dialog === 'remove' && (
      <Dialog
        title={t(group.archived ? 'Restore group' : linked ? 'Archive group' : 'Delete group')}
        onClose={() => setDialog(null)}
        footer={
          <Button variant="danger" onClick={confirmGroupAction}>
            {t('Confirm')}
          </Button>
        }
      >
        <p>
          {t(
            linked
              ? 'Linked students, classes, and attendance will be preserved.'
              : 'This empty group will be deleted.',
          )}
        </p>
        {error && <ErrorState>{error}</ErrorState>}
      </Dialog>
    )
  );
}
