import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};
export function Button({ className, variant = 'secondary', type = 'button', ...props }: Props) {
  return <button type={type} className={cn('button', variant, className)} {...props} />;
}
