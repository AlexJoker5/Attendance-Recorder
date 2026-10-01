import { z } from 'zod';
import { MAX_ENROLLMENT_REASON_LENGTH } from '../const/validationLimits';
export const enrollmentActionSchema = z.object({
  reason: z
    .string({ error: 'Enter a reason for this action.' })
    .trim()
    .min(1, 'Enter a reason for this action.')
    .max(MAX_ENROLLMENT_REASON_LENGTH, 'Reason must be 1,000 characters or fewer.'),
});
export type EnrollmentActionValues = z.infer<typeof enrollmentActionSchema>;
