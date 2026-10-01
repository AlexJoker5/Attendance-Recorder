export const ENROLLMENT_STATUSES = ['active', 'withdrawn', 'transferred'] as const;
export const STUDENT_STATUS_FILTERS = ['all', ...ENROLLMENT_STATUSES, 'Not enrolled'] as const;
