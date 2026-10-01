import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
export function ErrorState({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('error', className)} role="alert">
      {children}
    </p>
  );
}
