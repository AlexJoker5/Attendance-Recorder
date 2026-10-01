import { recordEvent } from '@/app/lib/auditEvents';
import type { AppData } from '@/app/types/appData';
import { blankCell } from '@/features/attendance/lib/attendanceCell';
import { uid } from '@/utils/uid';
import type { Enrollment } from '../types/enrollmentTypes';
export function enroll(data: AppData, studentId: string, groupId: string, joined: string) {
  const group = data.groups.find((item) => item.id === groupId);
  const semester = data.semesters.find((item) => item.id === group?.semesterId);
  if (!group || group.archived || !semester || semester.archived)
    throw new Error('Choose an active group and semester.');
  if (joined < semester.start || joined > semester.end)
    throw new Error('Enrollment date must be within this semester.');
  if (
    data.enrollments.some((item) => item.semesterId === semester.id && item.studentId === studentId)
  )
    throw new Error(
      'This student is already enrolled in this semester. Only one group is allowed.',
    );
  const enrollment: Enrollment = {
    id: uid(),
    studentId,
    groupId,
    semesterId: semester.id,
    joined,
    status: 'active',
    history: [],
  };
  data.enrollments.push(enrollment);
  data.sessions
    .filter(
      (session) => data.classes.find((cls) => cls.id === session.classId)?.groupId === groupId,
    )
    .forEach((session) => {
      session.attendance[studentId] =
        session.finalized && !session.extra && session.date < joined
          ? {
              status: 'Present',
              remark: 'Pre-enrollment credit',
              source: 'Pre-enrollment credit',
              revision: uid(),
            }
          : session.finalized
            ? { status: 'Absent', remark: '', source: 'Finalization', revision: uid() }
            : blankCell();
    });
  recordEvent(data, 'Enrolled student in all group classes');
}
