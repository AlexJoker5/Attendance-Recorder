import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  return <span className={cn('badge', tone)}>{children}</span>;
}
