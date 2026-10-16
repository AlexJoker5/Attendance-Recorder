import type { SortingState } from '@tanstack/react-table';

export const STUDENT_NAME_SORTING: SortingState = [{ id: 'name', desc: false }];
export const STUDENT_RESULT_SORTING: SortingState = [{ id: 'student', desc: false }];
export const STUDENT_NAME_COLLATOR = new Intl.Collator(['en', 'my'], {
  sensitivity: 'base',
  numeric: true,
});
