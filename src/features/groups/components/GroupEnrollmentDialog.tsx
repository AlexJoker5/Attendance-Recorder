import { Dialog } from '@/components/ui/Dialog';
import { EnrollmentForm } from '@/features/students/components/EnrollmentForm';
import { useTranslation } from 'react-i18next';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';

export type GroupEnrollmentDialogProps = Pick<GroupDetailsModel, 'dialog' | 'setDialog' | 'group'>;
export function GroupEnrollmentDialog({ dialog, setDialog, group }: GroupEnrollmentDialogProps) {
  const { t } = useTranslation();
  return (
    dialog === 'enroll' && (
      <Dialog title={t('Enroll existing student')} onClose={() => setDialog(null)} isFooter={false}>
        <EnrollmentForm groupId={group.id} onSaved={() => setDialog(null)} />
      </Dialog>
    )
  );
}
