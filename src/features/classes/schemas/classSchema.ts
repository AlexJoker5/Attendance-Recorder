import { z } from 'zod';
import { MAX_CLASS_NAME_LENGTH } from '../const/validationLimits';
import { CLASS_TIME_PATTERN } from '../const/validationPatterns';
export const classSchema = z
  .object({
    name: z
      .string({ error: 'Enter a class name.' })
      .trim()
      .min(1, 'Enter a class name.')
      .max(MAX_CLASS_NAME_LENGTH, 'Class name must be 100 characters or fewer.'),
    weekday: z
      .number({ error: 'Choose a weekly class day.' })
      .int('Choose a weekly class day.')
      .min(0, 'Choose a weekly class day.')
      .max(6, 'Choose a weekly class day.'),
    startDate: z.iso.date({ error: 'Choose a valid class start date.' }),
    endDate: z.iso.date({ error: 'Choose a valid class end date.' }),
    startTime: z
      .string({ error: 'Choose a valid start time.' })
      .regex(CLASS_TIME_PATTERN, 'Choose a valid start time.'),
    endTime: z
      .string({ error: 'Choose a valid end time.' })
      .regex(CLASS_TIME_PATTERN, 'Choose a valid end time.'),
  })
  .refine((item) => item.endDate >= item.startDate, {
    path: ['endDate'],
    message: 'End date must be on or after start date.',
  })
  .refine((item) => item.endTime > item.startTime, {
    path: ['endTime'],
    message: 'End time must be after start time.',
  });
export type ClassValues = z.infer<typeof classSchema>;
