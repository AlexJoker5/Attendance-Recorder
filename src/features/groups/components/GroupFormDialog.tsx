import { Dialog } from '@/components/ui/Dialog';
import { RecordForm } from '@/components/ui/RecordForm';
import { useTranslation } from 'react-i18next';
import type { GroupsModel } from '../hooks/useGroupsPage';
import { groupSchema } from '../schemas/groupSchema';

export type GroupFormDialogProps = Pick<GroupsModel, 'saveGroup' | 'editing' | 'setEditing'>;
export function GroupFormDialog({ saveGroup, editing, setEditing }: GroupFormDialogProps) {
  const { t } = useTranslation();
  return (
    editing && (
      <Dialog
        title={t(editing === 'new' ? 'Create group' : 'Edit group')}
        onClose={() => setEditing(null)}
        isFooter={false}
      >
        <RecordForm
          schema={groupSchema}
          defaults={{ name: editing === 'new' ? '' : editing.name }}
          fields={[{ name: 'name', label: 'Group name' }]}
          onSave={saveGroup}
          label={editing === 'new' ? 'Create' : 'Update'}
        />
      </Dialog>
    )
  );
}
