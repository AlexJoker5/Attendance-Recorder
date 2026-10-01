import { WORKSPACE_QUERY_KEY } from '@/app/const/storageKeys';
import type { AppData } from '@/app/types/appData';
import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readWorkspace, writeWorkspace } from '../api/workspaceRepository';

export function useAppData() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: WORKSPACE_QUERY_KEY, queryFn: readWorkspace });
  const pending = useIsMutating({ mutationKey: WORKSPACE_QUERY_KEY });
  const mutation = useMutation({
    mutationKey: WORKSPACE_QUERY_KEY,
    scope: { id: 'workspace-save' },
    mutationFn: async (edit: (data: AppData) => void) => {
      const current = client.getQueryData<AppData>(WORKSPACE_QUERY_KEY);
      if (!current) throw new Error('Workspace is not loaded.');
      const next = structuredClone(current);
      edit(next);
      const saved = await writeWorkspace(current, next);
      client.setQueryData(WORKSPACE_QUERY_KEY, saved);
      return saved;
    },
    onError: async () => {
      await client.invalidateQueries({ queryKey: WORKSPACE_QUERY_KEY });
    },
  });
  return { ...query, change: mutation.mutateAsync, saving: pending > 0 };
}
