import { z } from 'zod';
export const enrollmentSchema = z.object({
  studentId: z
    .string({ error: 'Choose a registered student.' })
    .min(1, 'Choose a registered student.'),
  groupId: z
    .string({ error: 'Choose a group for this enrollment.' })
    .min(1, 'Choose a group for this enrollment.'),
  joined: z.iso.date({ error: 'Choose a valid enrollment date.' }),
});
export type EnrollmentValues = z.infer<typeof enrollmentSchema>;
