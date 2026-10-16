import type { SortingState } from '@tanstack/react-table';

export const IMPORT_REVIEW_SORTING: SortingState = [{ id: 'description', desc: false }];
export const IMPORT_REVIEW_STATUS_ORDER = ['unresolved', 'matched', 'ignored'] as const;
