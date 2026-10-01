import { z } from 'zod';
export const loginSchema = z.object({
  email: z
    .string({ error: 'Enter your email address.' })
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email('Enter a valid email address.')),
  password: z.string({ error: 'Enter your password.' }).min(1, 'Enter your password.'),
});
export type LoginValues = z.infer<typeof loginSchema>;
