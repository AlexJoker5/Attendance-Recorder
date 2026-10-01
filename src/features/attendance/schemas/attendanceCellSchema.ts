import { z } from 'zod';
import { createdAtSchema } from '@/app/schemas/createdAtSchema';
import { ATTENDANCE_STATUSES } from '../const/attendanceStatus';
export const attendanceCellSchema = z.object({
  createdAt: createdAtSchema,
  status: z.enum(ATTENDANCE_STATUSES),
  remark: z.string(),
  source: z.string(),
  revision: z.uuid(),
});
