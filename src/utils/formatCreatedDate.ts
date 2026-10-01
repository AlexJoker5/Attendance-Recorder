import { APP_TIME_ZONE } from '@/app/const/appConfig';

export function formatCreatedDate(value: string | undefined, language: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return undefined;
  const date = new Date(value);
  const locale = language.startsWith('my') ? 'my-MM' : 'en-GB';
  return {
    date: new Intl.DateTimeFormat(locale, {
      timeZone: APP_TIME_ZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat(locale, {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date),
  };
}
