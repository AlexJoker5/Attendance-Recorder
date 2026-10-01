import { APP_TIME_ZONE } from '@/app/const/appConfig';
import { Dialog } from '@/components/ui/Dialog';
import { RecordForm } from '@/components/ui/RecordForm';
import { DEFAULT_CLASS_SCHEDULE } from '../const/scheduleDefaults';
import { useClassForm } from '../hooks/useClassForm';
import { classFormFields } from '../lib/classFormFields';
import { classSchema } from '../schemas/classSchema';
import { ScheduleChangePreview } from './ScheduleChangePreview';
export function ClassForm(props: Parameters<typeof useClassForm>[0]) {
  const model = useClassForm(props);
  if (!model) return null;
  const { t, existing, onClose, group, semester, review, setReview, saveClass, plan } = model;
  return (
    <Dialog title={t(existing ? 'Edit class' : 'Create class')} onClose={onClose} isFooter={false}>
      <p className="muted mb-5">
        {group.name} · {APP_TIME_ZONE}
      </p>
      <RecordForm
        schema={classSchema}
        defaults={
          existing || {
            name: '',
            ...DEFAULT_CLASS_SCHEDULE,
            startDate: semester.start,
            endDate: semester.end,
          }
        }
        fields={classFormFields(semester)}
        label={!review ? 'Preview changes' : existing ? 'Update' : 'Create'}
        onEdit={() => setReview(null)}
        onSave={saveClass}
      >
        <ScheduleChangePreview review={review} existing={existing} plan={plan} />
      </RecordForm>
    </Dialog>
  );
}
