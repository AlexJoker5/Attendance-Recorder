import { z } from 'zod';
import { createdAtSchema } from '@/app/schemas/createdAtSchema';
export const studentRecordSchema = z.object({
  id: z.uuid(),
  createdAt: createdAtSchema,
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  notes: z.string(),
  aliases: z.array(z.string()),
});
