import type { z } from 'zod';
import type {
  classShareSchema,
  publicClassSchema,
  publicSessionSchema,
} from '../schemas/sharingSchemas';

export type ClassShare = z.infer<typeof classShareSchema>;
export type PublicClass = z.infer<typeof publicClassSchema>;
export type PublicSession = z.infer<typeof publicSessionSchema>;
export type PublicAttendance = PublicClass['attendance'][number];
export type ShareAction = 'create' | 'replace' | 'revoke';
