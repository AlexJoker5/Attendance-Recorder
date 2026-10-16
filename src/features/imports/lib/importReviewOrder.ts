import { compareStudentNames } from '@/features/students/lib/studentNameOrder';
import { IMPORT_REVIEW_STATUS_ORDER } from '../const/importReviewSorting';
import type { ImportRow } from '../types/importTypes';

function priority(row: ImportRow) {
  const status = !row.studentId ? 'unresolved' : row.studentId === 'ignore' ? 'ignored' : 'matched';
  return IMPORT_REVIEW_STATUS_ORDER.indexOf(status);
}

export function compareImportReviewRows(a: ImportRow, b: ImportRow) {
  return (
    priority(a) - priority(b) ||
    compareStudentNames({ name: a.displayName || a.name }, { name: b.displayName || b.name })
  );
}
