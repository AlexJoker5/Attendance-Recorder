import { Panel } from '@/components/ui/Panel';
import type { StudentsModel } from '../hooks/useStudentsPage';
import { StudentsTable } from './StudentsTable';

export type StudentsTablePanelProps = Pick<StudentsModel, 'semester' | 'group' | 'status' | 'rows'>;
export function StudentsTablePanel({ semester, group, status, rows }: StudentsTablePanelProps) {
  return (
    <Panel>
      <StudentsTable semester={semester} group={group} status={status} rows={rows} />
    </Panel>
  );
}
