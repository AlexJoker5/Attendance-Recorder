import { useAppData } from '@/app/hooks/useAppData';
import { recordEvent } from '@/app/lib/auditEvents';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
export function useGroupDetails() {
  const { groupId } = useParams();
  const { data, change } = useAppData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<'class' | 'enroll' | 'import' | 'remove' | null>(null);
  const [error, setError] = useState('');
  const group = data?.groups.find((item) => item.id === groupId);
  if (!data || !group) return null;
  const semester = data.semesters.find((item) => item.id === group.semesterId)!;
  const readonly = semester.archived || group.archived;
  const linked =
    data.classes.some((cls) => cls.groupId === group.id) ||
    data.enrollments.some((item) => item.groupId === group.id);
  const rows = data.enrollments
    .filter((item) => item.groupId === group.id)
    .map((item) => ({
      ...item,
      student: data.students.find((student) => student.id === item.studentId)!,
    }));
  const confirmGroupAction = async () => {
    try {
      await change((next) => {
        if (linked) next.groups.find((item) => item.id === group.id)!.archived = !group.archived;
        else next.groups = next.groups.filter((item) => item.id !== group.id);
        recordEvent(next, 'Changed group archive state: ' + group.name);
      });
      setDialog(null);
      if (!linked) navigate('/groups');
    } catch (reason) {
      setError(String(reason));
    }
  };

  return {
    group,
    semester,
    readonly,
    setDialog,
    t,
    data,
    rows,
    linked,
    dialog,
    confirmGroupAction,
    error,
  };
}
export type GroupDetailsModel = NonNullable<ReturnType<typeof useGroupDetails>>;
