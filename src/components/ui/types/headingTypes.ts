import type { ReactNode } from 'react';
export interface HeadingContentProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}
