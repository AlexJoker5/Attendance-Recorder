import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { recordEvent } from '@/app/lib/auditEvents';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { uid } from '@/utils/uid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GroupValues } from '../schemas/groupSchema';
import type { Group } from '../types/groupTypes';
export function useGroupsPage() {
  const { t } = useTranslation();
  const { data, change } = useAppData();
  const { semesterId } = useWorkspace();
  const [editing, setEditing] = useState<Group | 'new' | null>(null);
  const [classGroup, setClassGroup] = useState('');
  const [search, setSearch] = useState('');
  if (!data) return null;
  const semester = selectedSemester(data, semesterId);
  const readonly = semester.archived;

  const saveGroup = async (values: GroupValues) => {
    if (!editing) return;

    await change((next) => {
      if (
        next.groups.some(
          (group) =>
            group.semesterId === semester.id &&
            group.id !== (editing === 'new' ? '' : editing.id) &&
            group.name.toLowerCase() === values.name.toLowerCase(),
        )
      )
        throw new Error('This group name already exists in the semester.');
      if (editing === 'new')
        next.groups.push({
          id: uid(),
          semesterId: semester.id,
          name: values.name,
          archived: false,
        });
      else next.groups.find((group) => group.id === editing.id)!.name = values.name;
      recordEvent(next, 'Saved group ' + values.name);
    });
    setEditing(null);
  };
  return {
    saveGroup,
    t,
    semester,
    readonly,
    setEditing,
    search,
    setSearch,
    data,
    setClassGroup,
    editing,
    change,
    classGroup,
  };
}
export type GroupsModel = NonNullable<ReturnType<typeof useGroupsPage>>;
