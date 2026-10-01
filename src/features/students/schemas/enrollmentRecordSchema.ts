import { z } from 'zod';
import { createdAtSchema } from '@/app/schemas/createdAtSchema';
import { ENROLLMENT_STATUSES } from '../const/enrollmentStatus';
export const enrollmentRecordSchema = z.object({
  id: z.uuid(),
  createdAt: createdAtSchema,
  studentId: z.uuid(),
  groupId: z.uuid(),
  semesterId: z.uuid(),
  joined: z.iso.date(),
  status: z.enum(ENROLLMENT_STATUSES),
  history: z.array(
    z.object({ at: z.string(), status: z.enum(ENROLLMENT_STATUSES), reason: z.string() }),
  ),
});
