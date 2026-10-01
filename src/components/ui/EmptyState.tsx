import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('empty', className)}>{children}</p>;
}
