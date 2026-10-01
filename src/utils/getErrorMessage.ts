import { ZodError } from 'zod';
export function getErrorMessage(reason: unknown, fallback = 'Unable to save.') {
  if (reason instanceof ZodError)
    return [...new Set(reason.issues.map((issue) => issue.message))].join(' ');
  return reason instanceof Error ? reason.message : fallback;
}
