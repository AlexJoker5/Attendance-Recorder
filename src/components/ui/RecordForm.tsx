import { ErrorState } from '@/components/ui/ErrorState';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState, type ReactNode } from 'react';
import { Controller, useForm, type DefaultValues, type FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import { Button } from './Button';
import type { FormField } from './types/recordFormTypes';

export function RecordForm<T extends FieldValues>({
  schema,
  defaults,
  fields,
  onSave,
  label = 'Create',
  children,
  onEdit,
}: {
  schema: z.ZodType<T, T>;
  defaults: DefaultValues<T>;
  fields: FormField<T>[];
  onSave: (values: T) => Promise<void> | void;
  label?: string;
  children?: ReactNode;
  onEdit?: () => void;
}) {
  const { t } = useTranslation();
  const formId = useId();
  const [error, setError] = useState('');
  const { register, control, handleSubmit, formState, getFieldState } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });
  return (
    <form
      noValidate
      className="form-stack"
      onChange={onEdit}
      onSubmit={handleSubmit(async (values) => {
        setError('');
        try {
          await onSave(values);
        } catch (reason) {
          setError(getErrorMessage(reason, 'Unable to save.'));
        }
      })}
    >
      {fields.map((field) => {
        const id = formId + '-' + field.name;
        const registration =
          field.type === 'select' ? {} : register(field.name, { valueAsNumber: field.numeric });
        const state = getFieldState(field.name, formState);
        const common = {
          id,
          disabled: formState.isSubmitting,
          'aria-invalid': !!state.error,
          'aria-describedby': state.error ? id + '-error' : undefined,
          ...registration,
        };
        if (field.type === 'checkbox')
          return (
            <label key={field.name} className="actions">
              <input type="checkbox" {...common} />
              {t(field.label)}
            </label>
          );
        return (
          <Field
            key={field.name}
            label={t(field.label)}
            htmlFor={id}
            error={state.error?.message ? t(String(state.error.message)) : undefined}
          >
            {field.type === 'select' ? (
              <Controller
                control={control}
                name={field.name}
                render={({ field: binding }) => (
                  <Select
                    {...common}
                    name={binding.name}
                    ref={binding.ref}
                    onBlur={binding.onBlur}
                    value={String(binding.value ?? '')}
                    options={(field.options ?? []).map((option) => ({
                      ...option,
                      label: t(option.label),
                    }))}
                    onValueChange={(value) => {
                      binding.onChange(field.numeric ? Number(value) : value);
                      onEdit?.();
                    }}
                  />
                )}
              />
            ) : field.type === 'textarea' ? (
              <Textarea {...common} />
            ) : (
              <Input type={field.type || 'text'} min={field.min} max={field.max} {...common} />
            )}
          </Field>
        );
      })}
      {children}
      {error && <ErrorState>{t(error)}</ErrorState>}
      <div className="actions justify-end">
        <Button variant="primary" type="submit" disabled={formState.isSubmitting}>
          {t(formState.isSubmitting ? 'Saving…' : label)}
        </Button>
      </div>
    </form>
  );
}
