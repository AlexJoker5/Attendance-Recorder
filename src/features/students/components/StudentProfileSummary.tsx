import type { StudentDetailsModel } from '../hooks/useStudentDetails';
import { StudentEmailsPanel } from './StudentEmailsPanel';
import { StudentProfilePanel } from './StudentProfilePanel';

export type StudentProfileSummaryProps = Pick<
  StudentDetailsModel,
  'removeAdditionalEmail' | 'addAdditionalEmail' | 'student'
>;
export function StudentProfileSummary({
  removeAdditionalEmail,
  addAdditionalEmail,
  student,
}: StudentProfileSummaryProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <StudentProfilePanel student={student} />
      <StudentEmailsPanel
        student={student}
        removeAdditionalEmail={removeAdditionalEmail}
        addAdditionalEmail={addAdditionalEmail}
      />
    </div>
  );
}
