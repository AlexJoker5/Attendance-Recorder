import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

export interface SelectOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onChange' | 'children'
> {
  value: string | number;
  options: readonly SelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  ref?: Ref<HTMLButtonElement>;
}
