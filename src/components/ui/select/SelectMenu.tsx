import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { SelectModel } from './types/selectModelTypes';
import type { SelectOption } from './types/selectTypes';

export function SelectMenu({
  model,
  options,
  triggerId,
}: {
  model: SelectModel;
  options: readonly SelectOption[];
  triggerId: string;
}) {
  const { menuRef, listId, open } = model;
  if (!open) return null;
  return (
    <div
      ref={menuRef}
      id={listId}
      role="listbox"
      aria-labelledby={triggerId}
      popover="manual"
      className="dropdown-menu"
      onPointerDown={(event) => event.preventDefault()}
    >
      {options.map((option, index) => (
        <div
          key={String(option.value)}
          id={model.listId + '-' + index}
          role="option"
          aria-selected={index === model.selectedIndex}
          aria-disabled={option.disabled || undefined}
          data-option-index={index}
          className={cn(
            'dropdown-option',
            index === model.active && 'highlighted',
            index === model.selectedIndex && 'selected',
            option.disabled && 'disabled',
          )}
          onPointerMove={() => {
            if (!option.disabled) model.setActiveIndex(index);
          }}
          onClick={() => model.choose(index)}
        >
          <span>{option.label}</span>
          {index === model.selectedIndex && <Check size={16} aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}
