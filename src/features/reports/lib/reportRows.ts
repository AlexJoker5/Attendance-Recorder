import type { AppData } from '@/app/types/appData';
import { attendanceResult } from '@/features/attendance/lib/attendanceResult';
import { compareStudentNames } from '@/features/students/lib/studentNameOrder';

export function reportRows(data: AppData, semesterId: string) {
  return data.enrollments
    .filter((enrollment) => enrollment.semesterId === semesterId)
    .flatMap((enrollment) =>
      data.classes
        .filter((cls) => cls.groupId === enrollment.groupId)
        .map((cls) => ({
          student: data.students.find((item) => item.id === enrollment.studentId)!,
          enrollment,
          cls,
          group: data.groups.find((item) => item.id === cls.groupId)!,
          ...attendanceResult(data, cls, enrollment),
        })),
    )
    .sort((a, b) => compareStudentNames(a.student, b.student));
}
