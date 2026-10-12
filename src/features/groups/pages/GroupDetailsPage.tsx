import { Button } from '@/components/ui/Button';
import { PageHeading } from '@/components/ui/PageHeading';
import { ClassForm } from '@/features/classes/components/ClassForm';
import { ArrowDownToLine, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GroupClasses } from '../components/GroupClasses';
import { GroupEnrollmentDialog } from '../components/GroupEnrollmentDialog';
import { GroupEnrollmentPanel } from '../components/GroupEnrollmentPanel';
import { GroupLifecycleDialog } from '../components/GroupLifecycleDialog';
import { StudentImport } from '../components/StudentImport';
import { useGroupDetails } from '../hooks/useGroupDetails';
export default function GroupDetailsPage() {
  const model = useGroupDetails();
  const { t } = useTranslation();
  if (!model) return <p>{t('Group not found.')}</p>;
  const {
    group,
    semester,
    readonly,
    setDialog,
    data,
    rows,
    dialog,
    error,
  } = model;
  return (
    <>
      <PageHeading
        title={group.name}
        description={semester.name}
        actions={
          <>
            <Button disabled={readonly} onClick={() => setDialog('import')}>
              <ArrowDownToLine size={16} />
              {t('Import students')}
            </Button>
            <Button disabled={readonly} onClick={() => setDialog('enroll')}>
              {t('Enroll existing student')}
            </Button>
            <Button variant="primary" disabled={readonly} onClick={() => setDialog('class')}>
              <Plus size={16} />
              {t('Create class')}
            </Button>
          </>
        }
      />
      {group.archived && <p className="callout warning mb-5">{t('Archived group')}</p>}
      <GroupClasses data={data} group={group} />
      <GroupEnrollmentPanel
        rows={rows}
        promptUnenrollSingle={model.promptUnenrollSingle}
        readonly={readonly}
        setDialog={setDialog}
      />
      <div className="actions mt-6 flex gap-3 flex-wrap">
        <Button
          variant="secondary"
          disabled={semester.archived}
          onClick={() => setDialog('archive')}
        >
          {t(group.archived ? 'Restore group' : 'Archive group')}
        </Button>
        <Button
          variant="danger"
          disabled={semester.archived}
          onClick={() => setDialog('delete')}
        >
          {t('Delete group')}
        </Button>
      </div>
      {dialog === 'class' && <ClassForm groupId={group.id} onClose={() => setDialog(null)} />}
      {dialog === 'import' && <StudentImport groupId={group.id} onClose={() => setDialog(null)} />}
      <GroupEnrollmentDialog dialog={dialog} setDialog={setDialog} group={group} />
      <GroupLifecycleDialog
        dialog={dialog}
        group={group}
        classes={model.classes}
        enrollments={model.enrollments}
        targetEnrollment={model.targetEnrollment}
        setDialog={setDialog}
        toggleArchiveGroup={model.toggleArchiveGroup}
        handleUnenrollSingle={model.handleUnenrollSingle}
        handleUnenrollAll={model.handleUnenrollAll}
        handleDeleteGroup={model.handleDeleteGroup}
        error={error}
      />
    </>
  );
}

