import { Dialog } from '@/components/ui/Dialog';
import { RecordForm } from '@/components/ui/RecordForm';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';
import { sessionSchema } from '../schemas/sessionSchema';

export type AddSessionDialogProps = Pick<
  ClassDetailsModel,
  'addSession' | 'dialog' | 'setDialog' | 'semester'
>;
export function AddSessionDialog({
  addSession,
  dialog,
  setDialog,
  semester,
}: AddSessionDialogProps) {
  const { t } = useTranslation();
  return (
    dialog === 'session' && (
      <Dialog title={t('Add session')} onClose={() => setDialog(null)} isFooter={false}>
        <RecordForm
          schema={sessionSchema}
          defaults={{ date: semester.start, extra: false }}
          fields={[
            {
              name: 'date',
              label: 'Session date',
              type: 'date',
              min: semester.start,
              max: semester.end,
            },
            {
              name: 'extra',
              label: 'Extra session — excluded from attendance and leave limits.',
              type: 'checkbox',
            },
          ]}
          onSave={addSession}
        />
      </Dialog>
    )
  );
}
