import type { AppData } from '@/app/types/appData';
import { normalizeEmail } from '@/utils/normalizeEmail';
export function emailOwner(data: AppData, email: string) {
  const normalized = normalizeEmail(email);
  return normalized
    ? data.students.find(
        (student) => student.email === normalized || student.aliases.includes(normalized),
      )
    : undefined;
}
export function assertEmail(data: AppData, email: string, exceptId?: string) {
  const owner = emailOwner(data, email);
  if (owner && owner.id !== exceptId)
    throw new Error(`Email conflict: ${email} already belongs to ${owner.name} (${owner.email}).`);
}
