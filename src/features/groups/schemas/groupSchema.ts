import { z } from 'zod';
import { MAX_GROUP_NAME_LENGTH } from '../const/validationLimits';
export const groupSchema = z.object({
  name: z
    .string({ error: 'Enter a group name.' })
    .trim()
    .min(1, 'Enter a group name.')
    .max(MAX_GROUP_NAME_LENGTH, 'Group name must be 100 characters or fewer.'),
});
export type GroupValues = z.infer<typeof groupSchema>;
