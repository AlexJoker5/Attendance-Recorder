import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { enroll } from '@/features/students/lib/enrollmentRules';
import { emailOwner } from '@/features/students/lib/studentEmails';
import { studentEmailSchema } from '@/features/students/schemas/studentEmailSchema';
import { uid } from '@/utils/uid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StudentImportRow } from '../types/studentImportTypes';

export function useStudentImport({ groupId, onClose }: { groupId: string; onClose: () => void }) {
  const { data, change } = useAppData();
  const { t } = useTranslation();
  const { notify } = useWorkspace();
  const [rows, setRows] = useState<StudentImportRow[]>([]);
  const [error, setError] = useState('');
  const group = data!.groups.find((item) => item.id === groupId)!;
  const semester = data!.semesters.find((item) => item.id === group.semesterId)!;
  const [joined, setJoined] = useState(semester.start);
  const reviewWorkbook = (raw: { name: string; email: string }[]) => {
    const seen = new Set<string>();
    setRows(
      raw.map((row) => {
        const owner = emailOwner(data!, row.email);
        const existing =
          owner &&
          data!.enrollments.find(
            (item) => item.studentId === owner.id && item.semesterId === semester.id,
          );
        const message = !row.name
          ? 'Student name is required.'
          : !studentEmailSchema.safeParse(row.email).success
            ? 'A valid student email is required.'
            : seen.has(row.email)
              ? 'Duplicate email in this file.'
              : existing
                ? 'Already enrolled in this semester.'
                : owner && owner.email !== row.email
                  ? 'This is an additional email. Use the primary email for student registration.'
                  : '';
        seen.add(row.email);
        return {
          ...row,
          description: message || (owner ? 'Enroll existing profile' : 'Register and enroll'),
          blocked: !!message,
          selected: !message,
        };
      }),
    );
  };
  const importStudents = async () => {
    setError('');
    try {
      await change((next) => {
        rows
          .filter((row) => row.selected && !row.blocked)
          .forEach((row) => {
            let student = emailOwner(next, row.email);
            if (!student) {
              student = {
                id: uid(),
                name: row.name,
                email: row.email,
                phone: '',
                notes: '',
                aliases: [],
              };
              next.students.push(student);
            }
            enroll(next, student.id, groupId, joined);
          });
      });
      notify(t('Students imported.'));
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Import failed.');
    }
  };

  return {
    t,
    onClose,
    group,
    semester,
    joined,
    setJoined,
    reviewWorkbook,
    rows,
    setRows,
    importStudents,
    error,
  };
}
export type StudentImportModel = NonNullable<ReturnType<typeof useStudentImport>>;
