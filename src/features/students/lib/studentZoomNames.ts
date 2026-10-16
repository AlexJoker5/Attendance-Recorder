import type { Student } from '../types/studentTypes';
import { MAX_ZOOM_NAMES_PER_STUDENT } from '@/features/imports/const/zoomNameRules';

export function normalizeZoomName(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/gu, ' ').toLowerCase();
}

export function zoomNameOwners(students: Student[], name: string, exceptId?: string) {
  const key = normalizeZoomName(name);
  if (!key) return [];
  return students.filter(
    (student) =>
      student.id !== exceptId &&
      [student.name, ...(student.zoomNames || [])].some(
        (candidate) => normalizeZoomName(candidate) === key,
      ),
  );
}

export function rememberZoomName(student: Student, name: string, students: Student[]) {
  const key = normalizeZoomName(name);
  if (!key || zoomNameOwners([student], name).length) return;
  const owners = zoomNameOwners(students, name, student.id);
  if (owners.length)
    throw new Error(
      `Zoom name “${name}” already belongs to ${owners.map((item) => item.name).join(', ')}. Remove that saved name or use a session-only match.`,
    );
  if ((student.zoomNames || []).length >= MAX_ZOOM_NAMES_PER_STUDENT)
    throw new Error('A student can have up to 50 saved Zoom names. Remove an unused name first.');
  student.zoomNames = [...(student.zoomNames || []), name.trim()];
}
