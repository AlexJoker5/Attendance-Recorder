import { z } from 'zod';
import { createdAtSchema } from '@/app/schemas/createdAtSchema';
export const semesterRecordSchema = z.object({
  id: z.uuid(),
  createdAt: createdAtSchema,
  name: z.string(),
  start: z.iso.date(),
  end: z.iso.date(),
  archived: z.boolean(),
});
