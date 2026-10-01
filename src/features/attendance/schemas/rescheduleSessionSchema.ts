import { z } from 'zod';
export const rescheduleSessionSchema = z.object({
  date: z.iso.date({ error: 'Choose a valid session date.' }),
});
export type RescheduleSessionValues = z.infer<typeof rescheduleSessionSchema>;
