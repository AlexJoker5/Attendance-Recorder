export const ATTENDANCE_SOURCES = [
  'Manual',
  'Import',
  'Finalization',
  'Pre-enrollment credit',
  '—',
] as const;
export const ATTENDANCE_SOURCE_FILTERS = ['all', ...ATTENDANCE_SOURCES] as const;
