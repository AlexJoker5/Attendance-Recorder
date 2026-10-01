import type { Path } from 'react-hook-form';
export interface FormField<T> {
  name: Path<T>;
  label: string;
  type?:
    'text' | 'password' | 'email' | 'date' | 'time' | 'number' | 'textarea' | 'checkbox' | 'select';
  options?: { value: string | number; label: string }[];
  numeric?: boolean;
  min?: string;
  max?: string;
}
