import { z } from 'zod';
import { ignoredZoomName } from '@/features/imports/lib/zoomNames';
import { MAX_ZOOM_NAME_LENGTH, ZOOM_ROLE_NAME } from '@/features/imports/const/zoomNameRules';

export const zoomNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter the Zoom name to approve.')
    .max(MAX_ZOOM_NAME_LENGTH, 'Zoom names must be 200 characters or fewer.')
    .refine(
      (name) => !ignoredZoomName(name) && !ZOOM_ROLE_NAME.test(name),
      'Device names and excluded host names cannot be approved.',
    ),
});
export type ZoomNameValues = z.infer<typeof zoomNameSchema>;
