import { z } from 'zod';
import { createdAtSchema } from '@/app/schemas/createdAtSchema';
export const classRecordSchema = z.object({
  id: z.uuid(),
  createdAt: createdAtSchema,
  groupId: z.uuid(),
  name: z.string(),
  weekday: z.number().int().min(0).max(6),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  startTime: z.string(),
  endTime: z.string(),
  archived: z.boolean(),
  completed: z.boolean(),
});
