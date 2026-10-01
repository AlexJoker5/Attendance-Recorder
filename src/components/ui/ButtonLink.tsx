import { cn } from '@/lib/cn';
import { Link, type LinkProps } from 'react-router';
export function ButtonLink({
  className,
  variant = 'secondary',
  ...props
}: LinkProps & { variant?: 'primary' | 'secondary' | 'danger' }) {
  return (
    <Link className={cn('button', variant !== 'secondary' && variant, className)} {...props} />
  );
}
