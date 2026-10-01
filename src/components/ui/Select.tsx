import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';
import { useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectMenu } from './select/SelectMenu';
import { useSelect } from './select/hooks/useSelect';
import type { SelectProps } from './select/types/selectTypes';

export function Select(props: SelectProps) {
  const {
    options,
    value,
    onValueChange,
    placeholder,
    className,
    ref,
    name,
    onKeyDown,
    onClick,
    onBlur,
    ...buttonProps
  } = props;
  const { t } = useTranslation();
  const model = useSelect({ value, options, onValueChange, disabled: buttonProps.disabled });
  const { triggerRef } = model;
  useImperativeHandle(ref, () => triggerRef.current!, [triggerRef]);
  const selected = options[model.selectedIndex];
  const triggerId = buttonProps.id ?? model.listId + '-trigger';
  return (
    <div className={cn('dropdown', className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        {...buttonProps}
        id={triggerId}
        disabled={buttonProps.disabled || !options.some((option) => !option.disabled)}
        ref={triggerRef}
        type="button"
        role="combobox"
        className="control dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={model.open}
        aria-controls={model.open ? model.listId : undefined}
        aria-activedescendant={
          model.open && model.active >= 0 ? model.listId + '-' + model.active : undefined
        }
        onBlur={(event) => {
          model.close();
          onBlur?.(event);
        }}
        onKeyDown={(event) => {
          model.onKeyDown(event);
          onKeyDown?.(event);
        }}
        onClick={(event) => {
          if (model.open) model.close();
          else model.openMenu();
          onClick?.(event);
        }}
      >
        <span className={cn('dropdown-value', !selected && 'muted')}>
          {selected?.label ?? placeholder ?? t('Choose an option')}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn('dropdown-chevron', model.open && 'open')}
        />
      </button>
      <SelectMenu model={model} options={options} triggerId={triggerId} />
    </div>
  );
}
