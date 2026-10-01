import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { PageHeading } from '@/components/ui/PageHeading';
import { Panel } from '@/components/ui/Panel';
import { ClassForm } from '@/features/classes/components/ClassForm';
import { Plus } from 'lucide-react';
import { GroupFormDialog } from '../components/GroupFormDialog';
import { GroupList } from '../components/GroupList';
import { useGroupsPage } from '../hooks/useGroupsPage';
export default function GroupsPage() {
  const model = useGroupsPage();

  if (!model) return null;
  const {
    t,
    semester,
    readonly,
    setEditing,
    search,
    setSearch,
    data,
    setClassGroup,
    editing,
    classGroup,
    saveGroup,
  } = model;
  return (
    <>
      <PageHeading
        title={t('Groups & classes')}
        description={semester.name}
        actions={
          <Button variant="primary" disabled={readonly} onClick={() => setEditing('new')}>
            <Plus size={16} />
            {t('Create group')}
          </Button>
        }
      />
      <Input
        className="max-w-md mb-6"
        aria-label={t('Search groups')}
        type="search"
        placeholder={t('Search groups')}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <GroupList
        data={data}
        semester={semester}
        search={search}
        readonly={readonly}
        setEditing={setEditing}
        setClassGroup={setClassGroup}
      />
      {!data.groups.some((group) => group.semesterId === semester.id) && (
        <Panel>
          <EmptyState>{t('No groups yet. Create a fresh group for this semester.')}</EmptyState>
        </Panel>
      )}
      <GroupFormDialog editing={editing} setEditing={setEditing} saveGroup={saveGroup} />
      {classGroup && <ClassForm groupId={classGroup} onClose={() => setClassGroup('')} />}
    </>
  );
}
