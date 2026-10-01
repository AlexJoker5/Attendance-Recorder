import { Children, isValidElement, type ReactNode } from 'react';
import type { SelectOption } from '../types/selectTypes';

export function optionText(label: ReactNode): string {
  return Children.toArray(label)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      return isValidElement<{ children?: ReactNode }>(child)
        ? optionText(child.props.children)
        : '';
    })
    .join('');
}

export function nextEnabledOption(
  options: readonly SelectOption[],
  from: number,
  direction: 1 | -1,
) {
  for (let step = 1; step <= options.length; step++) {
    const index = (from + direction * step + options.length) % options.length;
    if (!options[index].disabled) return index;
  }
  return -1;
}
