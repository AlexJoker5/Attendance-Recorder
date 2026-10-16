import { getErrorMessage } from '@/utils/getErrorMessage';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { today } from '@/utils/dateUtils';
import { useTranslation } from 'react-i18next';
import type { SessionModel } from '../hooks/useSessionAttendance';
import { AttendanceTable } from './AttendanceTable';

export type SessionAttendanceFormProps = Pick<
  SessionModel,
  | 'handleSubmit'
  | 'save'
  | 'setError'
  | 'filter'
  | 'source'
  | 'students'
  | 'readonly'
  | 'register'
  | 'control'
  | 'formState'
  | 'session'
  | 'setDialog'
  | 'saving'
>;
export function SessionAttendanceForm({
  handleSubmit,
  save,
  setError,
  filter,
  source,
  students,
  readonly,
  register,
  control,
  formState,
  session,
  setDialog,
  saving,
}: SessionAttendanceFormProps) {
  const { t } = useTranslation();
  return (
    <form
      onSubmit={handleSubmit(async () => {
        try {
          await save();
        } catch (reason) {
          setError(getErrorMessage(reason));
        }
      })}
    >
      <Panel>
        <AttendanceTable
          filter={filter}
          source={source}
          students={students}
          readonly={readonly || saving}
          register={register}
          control={control}
        />
      </Panel>
      {Object.keys(formState.errors).length > 0 && (
        <p role="alert" className="error">
          {t('Check the attendance values and remark lengths.')}
        </p>
      )}
      <div className="actions mt-6">
        <Button type="submit" disabled={readonly || saving || formState.isSubmitting}>
          {t('Save draft')}
        </Button>
        <Button
          variant="primary"
          disabled={readonly || saving || formState.isSubmitting || session.date > today()}
          onClick={() => setDialog('finalize')}
        >
          {t('Finalize attendance')}
        </Button>
        <Button
          disabled={readonly || saving || formState.isSubmitting}
          onClick={() => setDialog('reschedule')}
        >
          {t('Reschedule session')}
        </Button>
        <Button
          variant="danger"
          disabled={readonly || saving || formState.isSubmitting}
          onClick={() => setDialog('remove')}
        >
          {t('Remove session')}
        </Button>
      </div>
    </form>
  );
}
