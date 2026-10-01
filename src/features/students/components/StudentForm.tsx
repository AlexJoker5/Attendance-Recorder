import { RecordForm } from '@/components/ui/RecordForm';
import { useStudentForm } from '../hooks/useStudentForm';
import { studentSchema } from '../schemas/studentSchema';
export function StudentForm(props: Parameters<typeof useStudentForm>[0]) {
  const model = useStudentForm(props);
  if (!model) return null;
  const { existing, saveStudent } = model;
  return (
    <RecordForm
      schema={studentSchema}
      defaults={{
        name: existing?.name || '',
        email: existing?.email || '',
        phone: existing?.phone || '',
        notes: existing?.notes || '',
        keepEmail: false,
      }}
      fields={[
        { name: 'name', label: 'Student name' },
        { name: 'email', label: 'Primary email', type: 'email' },
        { name: 'phone', label: 'Phone (optional)' },
        { name: 'notes', label: 'Notes (optional)', type: 'textarea' },
        ...(existing
          ? [
              {
                name: 'keepEmail' as const,
                label: 'Keep the previous primary email as an additional verified email.',
                type: 'checkbox' as const,
              },
            ]
          : []),
      ]}
      onSave={saveStudent}
      label={existing ? 'Update' : 'Create'}
    />
  );
}
