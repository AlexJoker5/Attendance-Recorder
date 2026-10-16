import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { changeClassShare, readClassShare } from '../api/sharingRepository';
import { createShareKey } from '../lib/shareLinks';
import type { ShareAction } from '../types/sharingTypes';

export function useClassShare(classId: string) {
  const client = useQueryClient();
  const queryKey = ['class-share', classId];
  const query = useQuery({
    queryKey,
    queryFn: () => readClassShare(classId),
    retry: false,
    staleTime: 0,
  });
  const lock = useRef(false);
  const [confirmation, setConfirmation] = useState<'replace' | 'revoke' | null>(null);
  const mutation = useMutation({
    mutationFn: ({ action, expected }: { action: ShareAction; expected: string | null }) =>
      changeClassShare(
        classId,
        action,
        action === 'revoke' ? undefined : createShareKey(),
        expected,
      ),
    retry: false,
    onSuccess: (data) => {
      client.setQueryData(queryKey, data);
      setConfirmation(null);
    },
    // An interrupted write may have succeeded. Re-read; never automatically replay it.
    onError: () => {
      void query.refetch();
    },
  });
  async function change(action: ShareAction) {
    if (lock.current || !query.data || query.isFetching || query.isError) return;
    lock.current = true;
    try {
      await mutation.mutateAsync({ action, expected: query.data.token });
    } catch {
      /* The dialog renders the mutation error. */
    } finally {
      lock.current = false;
    }
  }
  return { query, mutation, confirmation, setConfirmation, change, busy: mutation.isPending };
}
