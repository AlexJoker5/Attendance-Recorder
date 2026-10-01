import type { useAppData } from '@/app/hooks/useAppData';
export type ClassSessionRemovalOptions = Pick<ReturnType<typeof useAppData>, 'data' | 'change'> & {
  classId: string | undefined;
};
