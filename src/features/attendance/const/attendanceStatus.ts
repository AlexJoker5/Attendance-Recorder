export const ATTENDANCE_STATUSES = ['Unmarked', 'Present', 'Absent', 'Leave'] as const;
export const ATTENDANCE_STATUS_FILTERS = ['all', ...ATTENDANCE_STATUSES] as const;
