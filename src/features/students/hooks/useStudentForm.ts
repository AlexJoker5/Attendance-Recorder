import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { recordEvent } from '@/app/lib/auditEvents';
import { uid } from '@/utils/uid';
import { useTranslation } from 'react-i18next';
import { assertEmail } from '../lib/studentEmails';
import type { StudentValues } from '../schemas/studentSchema';
import type { Student } from '../types/studentTypes';

export function useStudentForm({
  existing,
  onSaved,
}: {
  existing?: Student;
  onSaved: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { change } = useAppData();
  const { notify } = useWorkspace();
  const saveStudent = async (values: StudentValues) => {
    const id = existing?.id || uid();
    await change((next) => {
      assertEmail(next, values.email, id);
      const student: Student = {
        id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        notes: values.notes,
        aliases: [...(existing?.aliases || [])],
      };
      if (existing && values.keepEmail && existing.email !== values.email)
        student.aliases.push(existing.email);
      student.aliases = [...new Set(student.aliases)].filter((email) => email !== student.email);
      if (existing)
        Object.assign(
          next.students.find((item) => item.id === id)!,
          student,
        );
      else next.students.push(student);
      recordEvent(next, 'Saved student ' + values.name);
    });
    notify(t('Student saved.'));
    onSaved(id);
  };

  return { existing, saveStudent };
}
export type StudentFormModel = NonNullable<ReturnType<typeof useStudentForm>>;
