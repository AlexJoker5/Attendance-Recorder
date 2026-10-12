import { z } from 'zod';
export const loginSchema = z.object({
  email: z
    .string({ error: 'Enter your email address.' })
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email('Enter a valid email address.')),
  password: z.string({ error: 'Enter your password.' }).min(1, 'Enter your password.'),
});
export const signUpSchema = z.object({
  email: z
    .string({ error: 'Enter your email address.' })
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email('Enter a valid email address.')),
  password: z
    .string({ error: 'Enter your password.' })
    .min(6, 'Password must be at least 6 characters.'),
});
export const forgotPasswordSchema = z.object({
  email: z
    .string({ error: 'Enter your email address.' })
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email('Enter a valid email address.')),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ error: 'Enter your password.' })
      .min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z
      .string({ error: 'Confirm your password.' })
      .min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
