import { createContext } from 'react';

export interface WorkspaceValue {
  semesterId: string;
  setSemesterId: (id: string) => void;
  notify: (message: string) => void;
}
export const WorkspaceContext = createContext<WorkspaceValue | null>(null);
