import { Panel } from '@/components/ui/Panel';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';
import { StudentSemesterHistoryTable } from './StudentSemesterHistoryTable';

export type StudentSemesterHistoryProps = Pick<StudentDetailsModel, 'data' | 'student'>;
export function StudentSemesterHistory({ data, student }: StudentSemesterHistoryProps) {
  const { t } = useTranslation();
  return (
    <Panel className="mt-6" title={t('Semester history')}>
      <StudentSemesterHistoryTable data={data} student={student} />
    </Panel>
  );
}
