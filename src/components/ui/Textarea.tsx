import { cn } from '@/lib/cn';
import type { TextareaHTMLAttributes } from 'react';
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('control min-h-24', className)} {...props} />;
}
