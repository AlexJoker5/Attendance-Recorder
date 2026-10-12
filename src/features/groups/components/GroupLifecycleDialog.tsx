import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTranslation } from 'react-i18next';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';

export type GroupLifecycleDialogProps = Pick<
  GroupDetailsModel,
  | 'dialog'
  | 'group'
  | 'classes'
  | 'enrollments'
  | 'targetEnrollment'
  | 'setDialog'
  | 'toggleArchiveGroup'
  | 'handleUnenrollSingle'
  | 'handleUnenrollAll'
  | 'handleDeleteGroup'
  | 'error'
>;

export function GroupLifecycleDialog({
  dialog,
  group,
  classes,
  enrollments,
  targetEnrollment,
  setDialog,
  toggleArchiveGroup,
  handleUnenrollSingle,
  handleUnenrollAll,
  handleDeleteGroup,
  error,
}: GroupLifecycleDialogProps) {
  const { t } = useTranslation();

  if (!dialog) return null;

  if (dialog === 'archive') {
    return (
      <Dialog
        title={t(group.archived ? 'Restore group' : 'Archive group')}
        onClose={() => setDialog(null)}
        footer={
          <Button variant="primary" onClick={toggleArchiveGroup}>
            {t('Confirm')}
          </Button>
        }
      >
        <p>
          {t(
            group.archived
              ? 'Restore this group to active state.'
              : 'Linked students, classes, and attendance will be preserved.',
          )}
        </p>
        {error && <ErrorState>{error}</ErrorState>}
      </Dialog>
    );
  }

  if (dialog === 'unenrollSingle') {
    return (
      <Dialog
        title={t('Unenroll student')}
        onClose={() => setDialog(null)}
        footer={
          <Button variant="danger" onClick={handleUnenrollSingle}>
            {t('Unenroll')}
          </Button>
        }
      >
        <p>
          {t('Are you sure you want to unenroll')}{' '}
          <strong>{targetEnrollment?.student?.name}</strong>?{' '}
          {t(
            'Their attendance in this group will be removed, but their student profile will remain.',
          )}
        </p>
        {error && <ErrorState>{error}</ErrorState>}
      </Dialog>
    );
  }

  if (dialog === 'unenrollAll') {
    return (
      <Dialog
        title={t('Unenroll all students')}
        onClose={() => setDialog(null)}
        footer={
          <Button variant="danger" onClick={handleUnenrollAll}>
            {t('Unenroll all')}
          </Button>
        }
      >
        <p>
          {t(
            'This will remove all students from this group and remove their attendance in this group’s classes. Student profiles will not be deleted.',
          )}
        </p>
        {error && <ErrorState>{error}</ErrorState>}
      </Dialog>
    );
  }

  if (dialog === 'delete') {
    const hasEnrollments = enrollments.length > 0;
    return (
      <Dialog
        title={t('Delete group')}
        onClose={() => setDialog(null)}
        footer={
          <div className="flex items-center justify-end gap-3 flex-wrap">
            {hasEnrollments && (
              <Button variant="secondary" onClick={handleUnenrollAll}>
                {t('Unenroll students first')}
              </Button>
            )}
            <Button variant="danger" onClick={handleDeleteGroup}>
              {t(hasEnrollments ? 'Unenroll & delete group' : 'Confirm delete')}
            </Button>
          </div>
        }
      >
        <div className="form-stack">
          {hasEnrollments ? (
            <>
              <p className="callout warning">
                {t(
                  'This group has enrolled students. You can unenroll students first, or unenroll them and delete the group with its classes in one step.',
                )}
              </p>
              <p>
                {t('Enrolled students')}: <strong>{enrollments.length}</strong> ·{' '}
                {t('Classes')}: <strong>{classes.length}</strong>
              </p>
              <p>
                {t(
                  'Deleting will remove all classes and sessions in this group, unenroll all students, and permanently delete the group.',
                )}
              </p>
            </>
          ) : (
            <p>
              {classes.length > 0
                ? `${t('This group and its')} ${classes.length} ${t('class(es) will be permanently deleted.')}`
                : t('This empty group will be deleted.')}
            </p>
          )}
        </div>
        {error && <ErrorState>{error}</ErrorState>}
      </Dialog>
    );
  }

  return null;
}

