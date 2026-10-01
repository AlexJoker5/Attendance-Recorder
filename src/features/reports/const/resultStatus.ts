export const RESULT_STATUSES = [
  'No finalized attendance',
  'At risk',
  'Failed',
  'Passed',
  'Meets requirement so far',
] as const;
export const RESULT_FILTERS = ['all', ...RESULT_STATUSES] as const;
