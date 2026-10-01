import { Panel } from '@/components/ui/Panel';
import type { ImportsModel } from '../hooks/useImportHistory';
import { ImportHistoryTable } from './ImportHistoryTable';

export type ImportHistoryPanelProps = Pick<
  ImportsModel,
  'filter' | 'rows' | 'setSelected' | 'setError'
>;
export function ImportHistoryPanel({
  filter,
  rows,
  setSelected,
  setError,
}: ImportHistoryPanelProps) {
  return (
    <Panel>
      <ImportHistoryTable
        filter={filter}
        rows={rows}
        setSelected={setSelected}
        setError={setError}
      />
    </Panel>
  );
}
