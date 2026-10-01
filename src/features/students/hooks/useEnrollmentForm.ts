import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { useTranslation } from 'react-i18next';
import { enroll } from '../lib/enrollmentRules';

export function useEnrollmentForm({
  studentId,
  groupId,
  onSaved,
}: {
  studentId?: string;
  groupId?: string;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const { data, change } = useAppData();
  const { semesterId, notify } = useWorkspace();
  if (!data) return null;
  const semester = selectedSemester(data, semesterId);
  const groups = data.groups.filter((group) => group.semesterId === semester.id && !group.archived);
  const students = data.students.filter(
    (student) =>
      !data.enrollments.some(
        (item) => item.semesterId === semester.id && item.studentId === student.id,
      ),
  );
  const saveStudent = async (values: { studentId: string; groupId: string; joined: string }) => {
    await change((next) => enroll(next, values.studentId, values.groupId, values.joined));
    notify(t('Student enrolled.'));
    onSaved();
  };

  return { t, studentId, groupId, groups, semester, students, saveStudent };
}
export type EnrollmentFormModel = NonNullable<ReturnType<typeof useEnrollmentForm>>;
