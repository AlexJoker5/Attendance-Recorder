import { ButtonLink } from '@/components/ui/ButtonLink';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeading } from '@/components/ui/PageHeading';
import { useTranslation } from 'react-i18next';
import { EnrollmentActionDialog } from '../components/EnrollmentActionDialog';
import { StudentEnrollmentPanel } from '../components/StudentEnrollmentPanel';
import { StudentProfileSummary } from '../components/StudentProfileSummary';
import { StudentSemesterHistory } from '../components/StudentSemesterHistory';
import { useStudentDetails } from '../hooks/useStudentDetails';
export default function StudentDetailsPage() {
  const model = useStudentDetails();
  const { t } = useTranslation();
  if (!model) return <p>{t('Student not found.')}</p>;
  const {
    student,
    error,
    semester,
    enrollment,
    data,
    setAction,
    rows,
    action,
    updateEnrollmentStatus,
    removeAdditionalEmail,
    addAdditionalEmail,
  } = model;
  return (
    <>
      <PageHeading
        title={student.name}
        description={student.email}
        actions={
          <ButtonLink to={'/students/' + student.id + '/edit'}>{t('Edit student')}</ButtonLink>
        }
      />
      <StudentProfileSummary
        student={student}
        removeAdditionalEmail={removeAdditionalEmail}
        addAdditionalEmail={addAdditionalEmail}
      />
      {error && <ErrorState>{error}</ErrorState>}
      <StudentEnrollmentPanel
        semester={semester}
        enrollment={enrollment}
        data={data}
        setAction={setAction}
        rows={rows}
      />
      <StudentSemesterHistory data={data} student={student} />
      <EnrollmentActionDialog
        action={action}
        setAction={setAction}
        student={student}
        updateEnrollmentStatus={updateEnrollmentStatus}
      />
    </>
  );
}
