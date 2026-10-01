import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { recordEvent } from '@/app/lib/auditEvents';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { attendanceResult } from '@/features/attendance/lib/attendanceResult';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import type { AdditionalEmailValues } from '../schemas/additionalEmailSchema';
import { assertEmail } from '../lib/studentEmails';
import type { EnrollmentActionValues } from '../schemas/enrollmentActionSchema';
import type { Lifecycle } from '../types/enrollmentTypes';
export function useStudentDetails() {
  const { studentId } = useParams();
  const { data, change } = useAppData();
  const { semesterId } = useWorkspace();
  const { t } = useTranslation();
  const [action, setAction] = useState<Lifecycle | 'enroll' | null>(null);
  const [error, setError] = useState('');
  const student = data?.students.find((item) => item.id === studentId);
  if (!data || !student) return null;
  const semester = selectedSemester(data, semesterId);
  const enrollment = data.enrollments.find(
    (item) => item.semesterId === semester.id && item.studentId === student.id,
  );
  const rows = data.classes
    .filter((cls) => cls.groupId === enrollment?.groupId)
    .map((cls) => ({ cls, enrollment: enrollment!, ...attendanceResult(data, cls, enrollment!) }));

  const updateEnrollmentStatus = async (values: EnrollmentActionValues) => {
    if (!action || action === 'enroll' || !enrollment) return;

    await change((next) => {
      const current = next.enrollments.find((item) => item.id === enrollment!.id)!;
      current.status = action;
      current.history.push({
        at: new Date().toISOString(),
        status: action,
        reason: values.reason,
      });
      recordEvent(next, `${action}: ${student.name} — ${values.reason}`);
    });
    setAction(null);
  };
  const addAdditionalEmail = async (values: AdditionalEmailValues) => {
    await change((next) => {
      const current = next.students.find((item) => item.id === student.id)!;
      if (values.email === current.email)
        throw new Error('This is already the primary email. Enter a different email.');
      if (current.aliases.includes(values.email))
        throw new Error('This additional email is already saved for this student.');
      assertEmail(next, values.email, current.id);
      current.aliases.push(values.email);
      recordEvent(next, 'Added additional email for ' + current.name);
    });
  };
  const removeAdditionalEmail = async (email: string) => {
    try {
      await change((next) => {
        const current = next.students.find((item) => item.id === student.id)!;
        current.aliases = current.aliases.filter((item) => item !== email);
        recordEvent(next, 'Removed additional email for ' + student.name);
      });
    } catch (reason) {
      setError(String(reason));
    }
  };
  return {
    removeAdditionalEmail,
    addAdditionalEmail,
    updateEnrollmentStatus,
    student,
    t,
    change,
    setError,
    error,
    semester,
    enrollment,
    data,
    setAction,
    rows,
    action,
  };
}
export type StudentDetailsModel = NonNullable<ReturnType<typeof useStudentDetails>>;
