import type { ClassSession } from '@/features/attendance/types/attendanceTypes';
import type { TeachingClass } from '@/features/classes/types/classTypes';
import type { Group } from '@/features/groups/types/groupTypes';
import type { ImportRecord } from '@/features/imports/types/importTypes';
import type { Semester } from '@/features/semesters/types/semesterTypes';
import type { Enrollment } from '@/features/students/types/enrollmentTypes';
import type { Student } from '@/features/students/types/studentTypes';
export interface AuditEvent {
  id: string;
  at: string;
  description: string;
}
export interface AppData {
  version: 1;
  revision: number;
  semesters: Semester[];
  groups: Group[];
  classes: TeachingClass[];
  students: Student[];
  enrollments: Enrollment[];
  sessions: ClassSession[];
  imports: ImportRecord[];
  events: AuditEvent[];
}
