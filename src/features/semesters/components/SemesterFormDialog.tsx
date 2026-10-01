import { Dialog } from '@/components/ui/Dialog';
import { RecordForm } from '@/components/ui/RecordForm';
import { useTranslation } from 'react-i18next';
import type { SemestersModel } from '../hooks/useSemestersPage';
import { semesterSchema } from '../schemas/semesterSchema';

export type SemesterFormDialogProps = Pick<
  SemestersModel,
  'saveSemester' | 'editing' | 'setEditing'
>;
export function SemesterFormDialog({ saveSemester, editing, setEditing }: SemesterFormDialogProps) {
  const { t } = useTranslation();
  return (
    editing && (
      <Dialog
        title={t(editing === 'new' ? 'Create semester' : 'Edit semester')}
        onClose={() => setEditing(null)}
        isFooter={false}
      >
        <RecordForm
          schema={semesterSchema}
          defaults={editing === 'new' ? { name: '', start: '', end: '' } : editing}
          fields={[
            { name: 'name', label: 'Semester name' },
            { name: 'start', label: 'Semester start date', type: 'date' },
            { name: 'end', label: 'Semester end date', type: 'date' },
          ]}
          onSave={saveSemester}
          label={editing === 'new' ? 'Create' : 'Update'}
        />
      </Dialog>
    )
  );
}
