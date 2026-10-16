import { STUDENT_NAME_COLLATOR } from '../const/studentSorting';
import type { Student } from '../types/studentTypes';

export function compareStudentNames(a: Pick<Student, 'name'>, b: Pick<Student, 'name'>) {
  return STUDENT_NAME_COLLATOR.compare(
    a.name.normalize('NFKC').trim(),
    b.name.normalize('NFKC').trim(),
  );
}
