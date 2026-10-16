import { useEffect } from 'react';

export function usePublicMetadata() {
  useEffect(() => {
    const title = document.title;
    document.title = 'Shared class · Attendance Admin';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow, noarchive';
    const referrer = document.createElement('meta');
    referrer.name = 'referrer';
    referrer.content = 'no-referrer';
    document.head.append(robots, referrer);
    return () => {
      robots.remove();
      referrer.remove();
      document.title = title;
    };
  }, []);
}
