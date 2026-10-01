import { z } from 'zod';
export const studentEmailSchema = z
  .string({ error: 'Enter an email address.' })
  .trim()
  .toLowerCase()
  .min(1, 'Enter an email address.')
  .pipe(z.email('Enter a valid email address.'));
