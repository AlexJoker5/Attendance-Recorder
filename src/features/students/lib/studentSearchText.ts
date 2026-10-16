import type { Student } from '../types/studentTypes';

// Search saved contact and Zoom aliases without changing the displayed name or its sort order.
export function studentSearchText(student: Student) {
  return [
    student.name,
    student.email,
    ...(student.aliases ?? []),
    ...(student.zoomNames ?? []),
  ].join(' ');
}
