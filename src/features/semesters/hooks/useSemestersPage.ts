import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { recordEvent } from '@/app/lib/auditEvents';
import { uid } from '@/utils/uid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import type { SemesterValues } from '../schemas/semesterSchema';
import type { Semester } from '../types/semesterTypes';
export function useSemestersPage() {
  const { t } = useTranslation();
  const { data, change } = useAppData();
  const { setSemesterId, notify } = useWorkspace();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Semester | 'new' | null>(null);
  const [error, setError] = useState('');
  if (!data) return null;
  async function archive(semester: Semester) {
    try {
      await change((next) => {
        next.semesters.find((item) => item.id === semester.id)!.archived = !semester.archived;
        recordEvent(
          next,
          `${semester.archived ? 'Restored' : 'Archived'} semester ${semester.name}`,
        );
      });
    } catch (reason) {
      setError(String(reason));
    }
  }

  const saveSemester = async (values: SemesterValues) => {
    if (!editing) return;

    const id = editing === 'new' ? uid() : editing.id;
    await change((next) => {
      if (editing === 'new') next.semesters.push({ id, ...values, archived: false });
      else {
        const groups = next.groups
          .filter((group) => group.semesterId === id)
          .map((group) => group.id);
        if (
          next.classes.some(
            (cls) =>
              groups.includes(cls.groupId) &&
              (cls.startDate < values.start || cls.endDate > values.end),
          ) ||
          next.sessions.some(
            (session) =>
              groups.includes(
                next.classes.find((cls) => cls.id === session.classId)?.groupId || '',
              ) &&
              !session.removed &&
              (session.date < values.start || session.date > values.end),
          ) ||
          next.enrollments.some(
            (enrollment) =>
              enrollment.semesterId === id &&
              (enrollment.joined < values.start || enrollment.joined > values.end),
          )
        )
          throw new Error(
            'Semester dates must contain existing schedules, sessions, and enrollment dates.',
          );
        Object.assign(
          next.semesters.find((item) => item.id === id)!,
          values,
        );
      }
      recordEvent(next, 'Saved semester ' + values.name);
    });
    setSemesterId(id);
    setEditing(null);
    notify(t('Semester saved.'));
  };
  return {
    saveSemester,
    t,
    setEditing,
    error,
    data,
    setSemesterId,
    navigate,
    archive,
    editing,
    change,
    notify,
  };
}
export type SemestersModel = NonNullable<ReturnType<typeof useSemestersPage>>;
