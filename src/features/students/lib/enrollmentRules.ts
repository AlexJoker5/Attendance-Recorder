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

export function unenroll(data: AppData, enrollmentId: string) {
  const enrollment = data.enrollments.find((item) => item.id === enrollmentId);
  if (!enrollment) throw new Error('Enrollment not found.');
  const student = data.students.find((item) => item.id === enrollment.studentId);
  const group = data.groups.find((item) => item.id === enrollment.groupId);

  const groupClasses = data.classes.filter((cls) => cls.groupId === enrollment.groupId);
  const classIds = new Set(groupClasses.map((c) => c.id));

  data.sessions.forEach((session) => {
    if (classIds.has(session.classId) && session.attendance[enrollment.studentId]) {
      delete session.attendance[enrollment.studentId];
    }
  });

  data.enrollments = data.enrollments.filter((item) => item.id !== enrollmentId);
  recordEvent(
    data,
    `Unenrolled student ${student?.name || 'Student'} from ${group?.name || 'group'}`,
  );
}

export function unenrollAllGroupStudents(data: AppData, groupId: string) {
  const group = data.groups.find((item) => item.id === groupId);
  if (!group) throw new Error('Group not found.');
  const targetEnrollments = data.enrollments.filter((item) => item.groupId === groupId);
  if (!targetEnrollments.length) return;

  const studentIds = new Set(targetEnrollments.map((item) => item.studentId));
  const groupClasses = data.classes.filter((cls) => cls.groupId === groupId);
  const classIds = new Set(groupClasses.map((c) => c.id));

  data.sessions.forEach((session) => {
    if (classIds.has(session.classId)) {
      studentIds.forEach((studentId) => {
        delete session.attendance[studentId];
      });
    }
  });

  data.enrollments = data.enrollments.filter((item) => item.groupId !== groupId);
  recordEvent(
    data,
    `Unenrolled all ${targetEnrollments.length} student(s) from group ${group.name}`,
  );
}

export function deleteGroupWithClasses(data: AppData, groupId: string) {
  const group = data.groups.find((item) => item.id === groupId);
  if (!group) throw new Error('Group not found.');

  // 1. Unenroll any students in this group
  unenrollAllGroupStudents(data, groupId);

  // 2. Remove all classes, schedules, sessions, and imports for this group
  const groupClasses = data.classes.filter((cls) => cls.groupId === groupId);
  const classIds = new Set(groupClasses.map((c) => c.id));

  const sessionsToDelete = data.sessions.filter((s) => classIds.has(s.classId));
  const sessionIds = new Set(sessionsToDelete.map((s) => s.id));

  data.imports = data.imports.filter((imp) => !sessionIds.has(imp.sessionId));
  data.sessions = data.sessions.filter((s) => !sessionIds.has(s.id));
  data.classes = data.classes.filter((cls) => cls.groupId !== groupId);

  // 3. Remove the group itself
  data.groups = data.groups.filter((g) => g.id !== groupId);

  recordEvent(data, `Deleted group ${group.name} and all its classes`);
}

