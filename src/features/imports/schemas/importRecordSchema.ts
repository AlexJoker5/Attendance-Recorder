import { attendanceCellSchema } from '@/features/attendance/schemas/attendanceCellSchema';
import { z } from 'zod';
export const importRecordSchema = z.object({
  id: z.uuid(),
  sessionId: z.uuid(),
  filename: z.string(),
  at: z.string(),
  count: z.number().int().nonnegative(),
  changes: z.array(
    z.object({
      studentId: z.uuid(),
      name: z.string(),
      before: attendanceCellSchema,
      after: attendanceCellSchema,
    }),
  ),
  undoneAt: z.string().optional(),
  summary: z.object({ restored: z.number().int(), preserved: z.number().int() }).optional(),
});
