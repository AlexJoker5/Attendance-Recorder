import { z } from 'zod';
import { MAX_SEMESTER_NAME_LENGTH } from '../const/validationLimits';
export const semesterSchema = z
  .object({
    name: z
      .string({ error: 'Enter a semester name.' })
      .trim()
      .min(1, 'Enter a semester name.')
      .max(MAX_SEMESTER_NAME_LENGTH, 'Semester name must be 100 characters or fewer.'),
    start: z.iso.date({ error: 'Choose a valid semester start date.' }),
    end: z.iso.date({ error: 'Choose a valid semester end date.' }),
  })
  .refine((item) => item.end >= item.start, {
    path: ['end'],
    message: 'End date must be on or after start date.',
  });
export type SemesterValues = z.infer<typeof semesterSchema>;
