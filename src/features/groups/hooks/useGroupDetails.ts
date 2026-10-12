import { useAppData } from '@/app/hooks/useAppData';
import { recordEvent } from '@/app/lib/auditEvents';
import {
  unenroll,
  unenrollAllGroupStudents,
  deleteGroupWithClasses,
} from '@/features/students/lib/enrollmentRules';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

export function useGroupDetails() {
  const { groupId } = useParams();
  const { data, change } = useAppData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<
    'class' | 'enroll' | 'import' | 'archive' | 'delete' | 'unenrollAll' | 'unenrollSingle' | null
  >(null);
  const [targetEnrollmentId, setTargetEnrollmentId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const group = data?.groups.find((item) => item.id === groupId);
  if (!data || !group) return null;
  const semester = data.semesters.find((item) => item.id === group.semesterId)!;
  const readonly = semester.archived || group.archived;
  const classes = data.classes.filter((cls) => cls.groupId === group.id);
  const enrollments = data.enrollments.filter((item) => item.groupId === group.id);
  const linked = classes.length > 0 || enrollments.length > 0;

  const rows = enrollments.map((item) => ({
    ...item,
    student: data.students.find((student) => student.id === item.studentId)!,
  }));

  const targetEnrollment = targetEnrollmentId
    ? rows.find((r) => r.id === targetEnrollmentId)
    : null;

  const toggleArchiveGroup = async () => {
    setError('');
    try {
      await change((next) => {
        next.groups.find((item) => item.id === group.id)!.archived = !group.archived;
        recordEvent(next, 'Changed group archive state: ' + group.name);
      });
      setDialog(null);
    } catch (reason) {
      setError(String(reason));
    }
  };

  const handleUnenrollSingle = async () => {
    if (!targetEnrollmentId) return;
    setError('');
    try {
      await change((next) => {
        unenroll(next, targetEnrollmentId);
      });
      setDialog(null);
      setTargetEnrollmentId(null);
    } catch (reason) {
      setError(String(reason));
    }
  };

  const handleUnenrollAll = async () => {
    setError('');
    try {
      await change((next) => {
        unenrollAllGroupStudents(next, group.id);
      });
      setDialog(null);
    } catch (reason) {
      setError(String(reason));
    }
  };

  const handleDeleteGroup = async () => {
    setError('');
    try {
      await change((next) => {
        deleteGroupWithClasses(next, group.id);
      });
      setDialog(null);
      navigate('/groups');
    } catch (reason) {
      setError(String(reason));
    }
  };

  const promptUnenrollSingle = (enrollmentId: string) => {
    setTargetEnrollmentId(enrollmentId);
    setDialog('unenrollSingle');
  };

  return {
    group,
    semester,
    readonly,
    setDialog,
    t,
    data,
    rows,
    classes,
    enrollments,
    linked,
    dialog,
    targetEnrollment,
    toggleArchiveGroup,
    handleUnenrollSingle,
    handleUnenrollAll,
    handleDeleteGroup,
    promptUnenrollSingle,
    error,
  };
}
export type GroupDetailsModel = NonNullable<ReturnType<typeof useGroupDetails>>;

