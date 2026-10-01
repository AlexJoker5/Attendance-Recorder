import { z } from 'zod';
import { createdAtSchema } from '@/app/schemas/createdAtSchema';
import { attendanceCellSchema } from './attendanceCellSchema';
export const sessionRecordSchema = z.object({
  createdAt: createdAtSchema,
  id: z.uuid(),
  classId: z.uuid(),
  date: z.iso.date(),
  extra: z.boolean(),
  generated: z.boolean(),
  removed: z.boolean(),
  removedBy: z.enum(['manual', 'schedule']).optional(),
  finalized: z.boolean(),
  attendance: z.record(z.uuid(), attendanceCellSchema),
});
