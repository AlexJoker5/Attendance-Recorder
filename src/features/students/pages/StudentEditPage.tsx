import { useAppData } from '@/app/hooks/useAppData';
import { PageHeading } from '@/components/ui/PageHeading';
import { Panel } from '@/components/ui/Panel';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { StudentForm } from '../components/StudentForm';

export default function StudentEditPage() {
  const { studentId } = useParams();
  const { data } = useAppData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const student = data?.students.find((item) => item.id === studentId);
  if (!student) return <p>{t('Student not found.')}</p>;
  return (
    <>
      <PageHeading title={t('Edit student')} description={student.name} />
      <Panel className="max-w-2xl">
        <StudentForm existing={student} onSaved={(id) => navigate('/students/' + id)} />
      </Panel>
    </>
  );
}
