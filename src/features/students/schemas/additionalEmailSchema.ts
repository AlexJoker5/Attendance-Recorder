import { z } from 'zod';
import { studentEmailSchema } from './studentEmailSchema';
export const additionalEmailSchema = z.object({ email: studentEmailSchema });
export type AdditionalEmailValues = z.infer<typeof additionalEmailSchema>;
