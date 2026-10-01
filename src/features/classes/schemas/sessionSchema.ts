import { z } from 'zod';
export const sessionSchema = z.object({
  date: z.iso.date({ error: 'Choose a valid session date.' }),
  extra: z.boolean({ error: 'Choose whether this is an extra session.' }),
});
export type SessionValues = z.infer<typeof sessionSchema>;
