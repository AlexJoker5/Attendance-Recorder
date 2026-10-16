import { Dialog } from '@/components/ui/Dialog';
import { RecordForm } from '@/components/ui/RecordForm';
import { useTranslation } from 'react-i18next';
import {
  additionalEmailSchema,
  type AdditionalEmailValues,
} from '../schemas/additionalEmailSchema';

export function AdditionalEmailDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (values: AdditionalEmailValues) => Promise<void>;
}) {
  const { t } = useTranslation();
  return (
    <Dialog title={t('Add additional email')} onClose={onClose} isFooter={false}>
      <p className="muted mb-5">
        {t('Save an additional contact email. Attendance imports match names only.')}
      </p>
      <RecordForm
        schema={additionalEmailSchema}
        defaults={{ email: '' }}
        fields={[{ name: 'email', label: 'Additional email', type: 'email' }]}
        label="Add email"
        onSave={async (values) => {
          await onSave(values);
          onClose();
        }}
      />
    </Dialog>
  );
}
