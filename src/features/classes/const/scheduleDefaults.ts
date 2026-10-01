export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
export const MAX_WEEKLY_SESSIONS = 520;
export const SESSION_STATE_FILTERS = ['active', 'draft', 'finalized', 'removed', 'all'] as const;
export const SESSION_TYPE_FILTERS = ['all', 'regular', 'extra'] as const;

export const DEFAULT_CLASS_SCHEDULE = { weekday: 6, startTime: '09:00', endTime: '10:30' } as const;
