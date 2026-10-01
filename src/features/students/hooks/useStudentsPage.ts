import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
export function useStudentsPage() {
  const { t } = useTranslation();
  const { data } = useAppData();
  const { semesterId } = useWorkspace();
  const [dialog, setDialog] = useState<'register' | 'enroll' | null>(null);
  const [group, setGroup] = useState('all');
  const [status, setStatus] = useState('all');
  if (!data) return null;
  const semester = selectedSemester(data, semesterId);
  const rows = data.students
    .map((student) => {
      const enrollment = data.enrollments.find(
        (item) => item.studentId === student.id && item.semesterId === semester.id,
      );
      return {
        ...student,
        groupId: enrollment?.groupId || '',
        group: data.groups.find((item) => item.id === enrollment?.groupId)?.name || 'Not enrolled',
        status: enrollment?.status || 'Not enrolled',
        joined: enrollment?.joined || '—',
      };
    })
    .filter(
      (row) =>
        (group === 'all' || (group === 'unenrolled' ? !row.groupId : row.groupId === group)) &&
        (status === 'all' || status === row.status),
    );

  return { t, setDialog, semester, group, setGroup, data, status, setStatus, rows, dialog };
}
export type StudentsModel = NonNullable<ReturnType<typeof useStudentsPage>>;
