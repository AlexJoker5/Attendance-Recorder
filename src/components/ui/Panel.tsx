import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
export function Panel({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('panel', className)}>
      {title && <h2 className="mb-5">{title}</h2>}
      {children}
    </section>
  );
}
