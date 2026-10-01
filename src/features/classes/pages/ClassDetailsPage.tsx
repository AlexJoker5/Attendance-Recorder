import { APP_TIME_ZONE } from '@/app/const/appConfig';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeading } from '@/components/ui/PageHeading';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AddSessionDialog } from '../components/AddSessionDialog';
import { ClassAttendanceOverview } from '../components/ClassAttendanceOverview';
import { ClassForm } from '../components/ClassForm';
import { ClassLifecycleActions } from '../components/ClassLifecycleActions';
import { ClassLifecycleDialog } from '../components/ClassLifecycleDialog';
import { ClassSessionRemovalDialog } from '../components/ClassSessionRemovalDialog';
import { ClassScheduleSummary } from '../components/ClassScheduleSummary';
import { ClassViewTabs } from '../components/ClassViewTabs';
import { WEEKDAYS as weekdays } from '../const/scheduleDefaults';
import { useClassDetails } from '../hooks/useClassDetails';
export default function ClassDetailsPage() {
  const model = useClassDetails();
  const { t } = useTranslation();
  if (!model) return <p>{t('Class not found.')}</p>;
  const {
    cls,
    group,
    readonly,
    setDialog,
    view,
    setView,
    error,
    state,
    setState,
    type,
    setType,
    from,
    setFrom,
    to,
    setTo,
    rows,
    results,
    canComplete,
    semester,
    all,
    dialog,
    confirmClassAction,
    addSession,
    restoreClassSession,
    requestRemoveClassSession,
    isRemovingSession,
    sessionToRemove,
    sessionRemovalError,
    cancelRemoveClassSession,
    confirmRemoveClassSession,
  } = model;
  return (
    <>
      <PageHeading
        title={cls.name}
        description={`${group.name} · ${t(weekdays[cls.weekday])} · ${cls.startTime}–${cls.endTime} · ${APP_TIME_ZONE}`}
        actions={
          <>
            <Button disabled={readonly} onClick={() => setDialog('edit')}>
              {t('Edit class')}
            </Button>
            <Button variant="primary" disabled={readonly} onClick={() => setDialog('session')}>
              <Plus size={16} />
              {t('Add session')}
            </Button>
          </>
        }
      />
      <ClassScheduleSummary cls={cls} />
      <ClassViewTabs view={view} setView={setView} />
      {error && <ErrorState>{error}</ErrorState>}
      <ClassAttendanceOverview
        view={view}
        state={state}
        setState={setState}
        type={type}
        setType={setType}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        rows={rows}
        readonly={readonly}
        results={results}
        restoreClassSession={restoreClassSession}
        requestRemoveClassSession={requestRemoveClassSession}
        isRemovingSession={isRemovingSession}
      />
      <ClassLifecycleActions
        readonly={readonly}
        cls={cls}
        canComplete={canComplete}
        setDialog={setDialog}
        semester={semester}
        group={group}
        all={all}
      />
      {!cls.completed && !canComplete && (
        <p className="muted mt-3">
          {t('Finalize all regular sessions before completing this class.')}
        </p>
      )}
      {dialog === 'edit' && (
        <ClassForm groupId={group.id} existing={cls} onClose={() => setDialog(null)} />
      )}
      <AddSessionDialog
        dialog={dialog}
        setDialog={setDialog}
        semester={semester}
        addSession={addSession}
      />
      <ClassSessionRemovalDialog
        sessionToRemove={sessionToRemove}
        isRemovingSession={isRemovingSession}
        sessionRemovalError={sessionRemovalError}
        cancelRemoveClassSession={cancelRemoveClassSession}
        confirmRemoveClassSession={confirmRemoveClassSession}
      />
      <ClassLifecycleDialog
        dialog={dialog}
        setDialog={setDialog}
        confirmClassAction={confirmClassAction}
      />
    </>
  );
}
