import { Dialog } from '@/components/ui/Dialog';
import { RecordForm } from '@/components/ui/RecordForm';
import { useTranslation } from 'react-i18next';
import type { SessionModel } from '../hooks/useSessionAttendance';
import { rescheduleSessionSchema } from '../schemas/rescheduleSessionSchema';

export type RescheduleSessionDialogProps = Pick<
  SessionModel,
  'rescheduleSession' | 'dialog' | 'setDialog' | 'session' | 'semester'
>;
export function RescheduleSessionDialog({
  rescheduleSession,
  dialog,
  setDialog,
  session,
  semester,
}: RescheduleSessionDialogProps) {
  const { t } = useTranslation();
  return (
    dialog === 'reschedule' && (
      <Dialog title={t('Reschedule session')} onClose={() => setDialog(null)} isFooter={false}>
        <RecordForm
          schema={rescheduleSessionSchema}
          defaults={{ date: session.date }}
          fields={[
            {
              name: 'date',
              label: 'Session date',
              type: 'date',
              min: semester.start,
              max: semester.end,
            },
          ]}
          onSave={rescheduleSession}
          label="Update"
        />
      </Dialog>
    )
  );
}
