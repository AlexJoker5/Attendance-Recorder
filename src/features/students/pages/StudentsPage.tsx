import { Button } from '@/components/ui/Button';
import { PageHeading } from '@/components/ui/PageHeading';
import { Plus, UserPlus } from 'lucide-react';
import { StudentFilters } from '../components/StudentFilters';
import { StudentRegistrationDialog } from '../components/StudentRegistrationDialog';
import { StudentsTablePanel } from '../components/StudentsTablePanel';
import { useStudentsPage } from '../hooks/useStudentsPage';
export default function StudentsPage() {
  const model = useStudentsPage();

  if (!model) return null;
  const { t, setDialog, semester, group, setGroup, data, status, setStatus, rows, dialog } = model;
  return (
    <>
      <PageHeading
        title={t('Students')}
        description={t('Register a profile once, then enroll it in a fresh group each semester.')}
        actions={
          <>
            <Button onClick={() => setDialog('enroll')} disabled={semester.archived}>
              <UserPlus size={16} />
              {t('Enroll existing student')}
            </Button>
            <Button variant="primary" onClick={() => setDialog('register')}>
              <Plus size={16} />
              {t('Register student')}
            </Button>
          </>
        }
      />
      <StudentFilters
        group={group}
        setGroup={setGroup}
        data={data}
        semester={semester}
        status={status}
        setStatus={setStatus}
      />
      <StudentsTablePanel semester={semester} group={group} status={status} rows={rows} />
      <StudentRegistrationDialog dialog={dialog} setDialog={setDialog} />
    </>
  );
}
