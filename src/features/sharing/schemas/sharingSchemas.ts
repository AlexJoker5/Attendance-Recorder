import { z } from 'zod';

export const shareKeySchema = z.string().regex(/^[0-9a-f]{64}$/);
export const classShareSchema = z
  .strictObject({
    enabled: z.boolean(),
    token: shareKeySchema.nullable(),
  })
  .refine((value) => value.enabled === (value.token !== null));

export const publicSessionSchema = z.strictObject({
  id: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  extra: z.boolean(),
  weekNumber: z.number().int().positive().nullable(),
});
export const publicClassSchema = z.strictObject({
  class: z.strictObject({
    name: z.string(),
    groupName: z.string(),
    semesterName: z.string(),
    timezone: z.string(),
  }),
  sessions: z.array(publicSessionSchema),
  students: z.array(z.strictObject({ name: z.string() })),
  attendance: z.array(
    z.strictObject({
      name: z.string(),
      status: z.enum(['Present', 'Absent', 'Leave', 'Unmarked']),
      remark: z.string(),
    }),
  ),
});
