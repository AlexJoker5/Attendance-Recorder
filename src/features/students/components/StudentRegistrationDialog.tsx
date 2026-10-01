import { Dialog } from '@/components/ui/Dialog';
import { useTranslation } from 'react-i18next';
import type { StudentsModel } from '../hooks/useStudentsPage';
import { EnrollmentForm } from './EnrollmentForm';
import { StudentForm } from './StudentForm';

export type StudentRegistrationDialogProps = Pick<StudentsModel, 'dialog' | 'setDialog'>;
export function StudentRegistrationDialog({ dialog, setDialog }: StudentRegistrationDialogProps) {
  const { t } = useTranslation();
  return (
    dialog && (
      <Dialog
        title={t(dialog === 'register' ? 'Register student' : 'Enroll existing student')}
        onClose={() => setDialog(null)}
        isFooter={false}
      >
        {dialog === 'register' ? (
          <StudentForm onSaved={() => setDialog(null)} />
        ) : (
          <EnrollmentForm onSaved={() => setDialog(null)} />
        )}
      </Dialog>
    )
  );
}
