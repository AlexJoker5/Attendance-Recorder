import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeading } from '@/components/ui/PageHeading';
import { Plus } from 'lucide-react';
import { SemesterFormDialog } from '../components/SemesterFormDialog';
import { SemestersTablePanel } from '../components/SemestersTablePanel';
import { useSemestersPage } from '../hooks/useSemestersPage';
export default function SemestersPage() {
  const model = useSemestersPage();

  if (!model) return null;
  const { t, setEditing, error, data, setSemesterId, navigate, archive, editing, saveSemester } =
    model;
  return (
    <>
      <PageHeading
        title={t('Semesters')}
        description={t(
          'Create a fresh student group for every semester. Student profiles can be reused.',
        )}
        actions={
          <Button variant="primary" onClick={() => setEditing('new')}>
            <Plus size={16} />
            {t('Create semester')}
          </Button>
        }
      />
      {error && <ErrorState>{error}</ErrorState>}
      <SemestersTablePanel
        data={data}
        setSemesterId={setSemesterId}
        navigate={navigate}
        setEditing={setEditing}
        archive={archive}
      />
      <SemesterFormDialog editing={editing} setEditing={setEditing} saveSemester={saveSemester} />
    </>
  );
}
