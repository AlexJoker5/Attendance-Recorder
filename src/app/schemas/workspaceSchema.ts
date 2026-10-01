import { semesterRecordSchema } from '@/features/semesters/schemas/semesterRecordSchema';
import { groupRecordSchema } from '@/features/groups/schemas/groupRecordSchema';
import { classRecordSchema } from '@/features/classes/schemas/classRecordSchema';
import { studentRecordSchema } from '@/features/students/schemas/studentRecordSchema';
import { enrollmentRecordSchema } from '@/features/students/schemas/enrollmentRecordSchema';
import { sessionRecordSchema } from '@/features/attendance/schemas/sessionRecordSchema';
import { importRecordSchema } from '@/features/imports/schemas/importRecordSchema';
import { z } from 'zod';

export const workspaceSchema = z.object({
  version: z.literal(1),
  revision: z.number().int().nonnegative(),
  semesters: z.array(semesterRecordSchema),
  groups: z.array(groupRecordSchema),
  classes: z.array(classRecordSchema),
  students: z.array(studentRecordSchema),
  enrollments: z.array(enrollmentRecordSchema),
  sessions: z.array(sessionRecordSchema),
  imports: z.array(importRecordSchema),
  events: z.array(z.object({ id: z.uuid(), at: z.string(), description: z.string() })),
});
