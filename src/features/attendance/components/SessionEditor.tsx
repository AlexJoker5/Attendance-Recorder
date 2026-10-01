import { ButtonLink } from '@/components/ui/ButtonLink';
import { ErrorState } from '@/components/ui/ErrorState';
import { ExportButtons } from '@/components/ui/ExportButtons';
import { PageHeading } from '@/components/ui/PageHeading';
import { ArrowDownToLine } from 'lucide-react';
import { useSessionAttendance } from '../hooks/useSessionAttendance';
import type { ClassSession } from '../types/attendanceTypes';
import { AttendanceFilters } from './AttendanceFilters';
import { RescheduleSessionDialog } from './RescheduleSessionDialog';
import { SessionAttendanceForm } from './SessionAttendanceForm';
import { SessionConfirmationDialog } from './SessionConfirmationDialog';
import { SessionStatusSummary } from './SessionStatusSummary';
export function SessionEditor({ session }: { session: ClassSession }) {
  const model = useSessionAttendance({ session });

  if (!model) return null;
  const {
    group,
    cls,
    exportAttendance,
    readonly,
    t,
    formState,
    error,
    filter,
    setFilter,
    source,
    setSource,
    handleSubmit,
    save,
    setError,
    students,
    register,
    control,
    setDialog,
    dialog,
    semester,
    confirmSessionAction,
    rescheduleSession,
  } = model;
  return (
    <>
      <PageHeading
        title={session.date}
        description={`${group.name} · ${cls.name} · ${cls.startTime}–${cls.endTime}`}
        actions={
          <>
            <ExportButtons onExport={exportAttendance} />
            {!readonly && (
              <ButtonLink className="primary" to={'/imports/' + session.id}>
                <ArrowDownToLine size={16} />
                {t('Import Zoom report')}
              </ButtonLink>
            )}
          </>
        }
      />
      <SessionStatusSummary session={session} formState={formState} />
      {session.extra && (
        <p className="callout mb-6">
          {t('Extra sessions do not count toward attendance percentages or leave limits.')}
        </p>
      )}
      {error && <ErrorState>{error}</ErrorState>}
      <AttendanceFilters
        filter={filter}
        setFilter={setFilter}
        source={source}
        setSource={setSource}
      />
      <SessionAttendanceForm
        handleSubmit={handleSubmit}
        save={save}
        setError={setError}
        filter={filter}
        source={source}
        students={students}
        readonly={readonly}
        register={register}
        control={control}
        formState={formState}
        session={session}
        setDialog={setDialog}
      />
      <p className="muted mt-4">
        {t(
          'Finalization applies to the full session, regardless of table filters. Active unmarked students become Absent; earlier pre-enrollment sessions receive Present credit.',
        )}
      </p>
      <RescheduleSessionDialog
        dialog={dialog}
        setDialog={setDialog}
        session={session}
        semester={semester}
        rescheduleSession={rescheduleSession}
      />
      <SessionConfirmationDialog
        dialog={dialog}
        setDialog={setDialog}
        confirmSessionAction={confirmSessionAction}
        error={error}
      />
    </>
  );
}
