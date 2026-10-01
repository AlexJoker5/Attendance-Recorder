import { Dialog } from '@/components/ui/Dialog';
import { RecordForm } from '@/components/ui/RecordForm';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';
import { enrollmentActionSchema } from '../schemas/enrollmentActionSchema';
import { EnrollmentForm } from './EnrollmentForm';

export type EnrollmentActionDialogProps = Pick<
  StudentDetailsModel,
  'updateEnrollmentStatus' | 'action' | 'setAction' | 'student'
>;
export function EnrollmentActionDialog({
  updateEnrollmentStatus,
  action,
  setAction,
  student,
}: EnrollmentActionDialogProps) {
  const { t } = useTranslation();
  return (
    action && (
      <Dialog
        title={t(
          action === 'enroll'
            ? 'Enroll student'
            : action === 'active'
              ? 'Reverse action'
              : action === 'withdrawn'
                ? 'Withdraw'
                : 'Transfer',
        )}
        onClose={() => setAction(null)}
        isFooter={action !== 'enroll'}
      >
        {action === 'enroll' ? (
          <EnrollmentForm studentId={student.id} onSaved={() => setAction(null)} />
        ) : (
          <>
            <p className="callout warning mb-5">
              {t(
                action === 'active'
                  ? 'Restore the original enrollment to Active. Results are recalculated; reversal does not guarantee a pass.'
                  : 'Withdrawal or transfer fails all classes in this original enrollment. Attendance and the original group are retained. You can reverse the action.',
              )}
            </p>
            <RecordForm
              schema={enrollmentActionSchema}
              defaults={{ reason: '' }}
              fields={[{ name: 'reason', label: 'Reason', type: 'textarea' }]}
              label="Confirm"
              onSave={updateEnrollmentStatus}
            />
          </>
        )}
      </Dialog>
    )
  );
}
