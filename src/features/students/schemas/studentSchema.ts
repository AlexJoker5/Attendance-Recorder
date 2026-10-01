import { z } from 'zod';
import {
  MAX_STUDENT_NAME_LENGTH,
  MAX_STUDENT_NOTES_LENGTH,
  MAX_STUDENT_PHONE_LENGTH,
} from '../const/validationLimits';
import { studentEmailSchema } from './studentEmailSchema';
export const studentSchema = z.object({
  name: z
    .string({ error: 'Enter the student name.' })
    .trim()
    .min(1, 'Enter the student name.')
    .max(MAX_STUDENT_NAME_LENGTH, 'Student name must be 120 characters or fewer.'),
  email: studentEmailSchema,
  phone: z
    .string({ error: 'Enter a phone number or leave it blank.' })
    .trim()
    .max(MAX_STUDENT_PHONE_LENGTH, 'Phone number must be 40 characters or fewer.'),
  notes: z
    .string({ error: 'Enter notes or leave them blank.' })
    .trim()
    .max(MAX_STUDENT_NOTES_LENGTH, 'Notes must be 2,000 characters or fewer.'),
  keepEmail: z.boolean({ error: 'Choose whether to keep the previous email.' }),
});
export type StudentValues = z.infer<typeof studentSchema>;
