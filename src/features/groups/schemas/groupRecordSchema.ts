import { z } from 'zod';
import { createdAtSchema } from '@/app/schemas/createdAtSchema';
export const groupRecordSchema = z.object({
  id: z.uuid(),
  createdAt: createdAtSchema,
  semesterId: z.uuid(),
  name: z.string(),
  archived: z.boolean(),
});
