import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import type { WorkbookMapperModel } from '../hooks/useWorkbookMapper';

export type WorkbookMappingFieldsProps = Pick<
  WorkbookMapperModel,
  | 'sheet'
  | 'setSheet'
  | 'setHeader'
  | 'detect'
  | 'book'
  | 'rows'
  | 'header'
  | 'nameColumn'
  | 'setNameColumn'
  | 'headers'
  | 'emailColumn'
  | 'setEmailColumn'
>;
export function WorkbookMappingFields({
  sheet,
  setSheet,
  setHeader,
  detect,
  book,
  rows,
  header,
  nameColumn,
  setNameColumn,
  headers,
  emailColumn,
  setEmailColumn,
}: WorkbookMappingFieldsProps) {
  const { t } = useTranslation();
  if (!book) return null;
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Field htmlFor="worksheet" label={t('Worksheet')}>
        <Select
          id="worksheet"
          value={sheet}
          onValueChange={(value) => {
            setSheet(value);
            setHeader(1);
            detect(book.worksheets[value][0] || []);
          }}
          options={Object.keys(book.worksheets).map((name) => ({ value: name, label: name }))}
        />
      </Field>
      <Field htmlFor="header-row" label={t('Header row')}>
        <Input
          id="header-row"
          type="number"
          min={1}
          max={rows.length}
          value={header}
          onChange={(event) => {
            const value = Math.max(1, Number(event.target.value));
            setHeader(value);
            detect(rows[value - 1] || []);
          }}
        />
      </Field>
      <Field htmlFor="name-column" label={t('Name column')}>
        <Select
          id="name-column"
          value={nameColumn}
          onValueChange={(value) => setNameColumn(Number(value))}
          options={headers.map((label, index) => ({
            value: index,
            label: (
              <>
                {index + 1}. {label || t('Unnamed column')}
              </>
            ),
          }))}
        />
      </Field>
      <Field htmlFor="email-column" label={t('Email column')}>
        <Select
          id="email-column"
          value={emailColumn}
          onValueChange={(value) => setEmailColumn(Number(value))}
          options={[
            { value: -1, label: t('No email column') },
            ...headers.map((label, index) => ({
              value: index,
              label: (
                <>
                  {index + 1}. {label || t('Unnamed column')}
                </>
              ),
            })),
          ]}
        />
      </Field>
    </div>
  );
}
