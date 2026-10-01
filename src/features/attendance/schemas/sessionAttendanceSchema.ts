import { z } from 'zod';
import { MAX_ATTENDANCE_REMARK_LENGTH } from '../const/attendancePolicy';
import { ATTENDANCE_STATUSES } from '../const/attendanceStatus';
export const sessionAttendanceSchema = z.object({
  cells: z.record(
    z.string(),
    z.object({
      status: z.enum(ATTENDANCE_STATUSES, { error: 'Choose an attendance status.' }),
      remark: z
        .string({ error: 'Enter a remark or leave it blank.' })
        .max(MAX_ATTENDANCE_REMARK_LENGTH, 'Remark must be 2,000 characters or fewer.'),
    }),
    { error: 'Review the attendance entries before saving.' },
  ),
});
export type SessionAttendanceValues = z.infer<typeof sessionAttendanceSchema>;
