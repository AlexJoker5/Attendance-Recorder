import { WorkspaceContext } from '@/app/workspaceContext';
import { useContext } from 'react';

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('Workspace provider is missing.');
  return context;
}
