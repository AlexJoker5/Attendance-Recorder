import { cn } from '@/lib/cn';
import type { HeadingContentProps } from './types/headingTypes';
export function Heading({
  title,
  description,
  actions,
  className,
  level,
}: HeadingContentProps & { level: 1 | 2 }) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <div className={cn('page-heading', className)}>
      <div>
        <Tag>{title}</Tag>
        {description && <p className="muted mt-2">{description}</p>}
      </div>
      <div className="actions">{actions}</div>
    </div>
  );
}
