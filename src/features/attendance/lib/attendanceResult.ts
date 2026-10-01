import type { AppData } from '@/app/types/appData';
import type { TeachingClass } from '@/features/classes/types/classTypes';
import type { Enrollment } from '@/features/students/types/enrollmentTypes';
import { today } from '@/utils/dateUtils';
import {
  MAX_APPROVED_LEAVES_PER_CLASS,
  MINIMUM_ATTENDANCE_PERCENTAGE,
} from '../const/attendancePolicy';
export function attendanceResult(data: AppData, cls: TeachingClass, enrollment: Enrollment) {
  const sessions = data.sessions.filter(
    (session) => session.classId === cls.id && !session.removed && !session.extra,
  );
  const held = sessions.filter((session) => session.finalized && session.date <= today());
  const cells = held
    .map((session) => session.attendance[enrollment.studentId])
    .filter((cell) => cell && cell.status !== 'Unmarked');
  const present = cells.filter((cell) => cell.status === 'Present').length;
  const leaves = cells.filter((cell) => cell.status === 'Leave').length;
  const absent = cells.filter((cell) => cell.status === 'Absent').length;
  const credits = cells.filter((cell) => cell.source === 'Pre-enrollment credit').length;
  const total = cells.length;
  const percentage = total ? (present / total) * 100 : null;
  const reasons: string[] = [];
  if (enrollment.status !== 'active')
    reasons.push(enrollment.status === 'withdrawn' ? 'Withdrawn' : 'Transferred');
  if (leaves > MAX_APPROVED_LEAVES_PER_CLASS) reasons.push('More than 3 approved leaves');
  if (percentage !== null && percentage < MINIMUM_ATTENDANCE_PERCENTAGE)
    reasons.push('Attendance below 75%');
  const failed =
    enrollment.status !== 'active' ||
    leaves > MAX_APPROVED_LEAVES_PER_CLASS ||
    (cls.completed && percentage !== null && percentage < MINIMUM_ATTENDANCE_PERCENTAGE);
  const label = failed
    ? 'Failed'
    : !total
      ? 'No finalized attendance'
      : percentage! < MINIMUM_ATTENDANCE_PERCENTAGE
        ? 'At risk'
        : cls.completed
          ? 'Passed'
          : 'Meets requirement so far';
  return {
    present,
    leaves,
    absent,
    credits,
    total,
    percentage,
    label,
    reasons,
    pending: sessions.length - held.length,
  };
}
