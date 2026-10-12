import { z } from 'zod';

export const updateNameSchema = z.object({
  fullName: z
    .string({ error: 'Enter your name.' })
    .trim()
    .min(1, 'Enter your name.'),
});

export const updateEmailSchema = z.object({
  email: z
    .string({ error: 'Enter your new email address.' })
    .trim()
    .min(1, 'Enter your new email address.')
    .pipe(z.email('Enter a valid email address.')),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string({ error: 'Enter a new password.' })
      .min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z
      .string({ error: 'Confirm your new password.' })
      .min(1, 'Confirm your new password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type UpdateNameValues = z.infer<typeof updateNameSchema>;
export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
