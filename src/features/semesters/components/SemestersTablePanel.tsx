import { Panel } from '@/components/ui/Panel';
import type { SemestersModel } from '../hooks/useSemestersPage';
import { SemestersTable } from './SemestersTable';

export type SemestersTablePanelProps = Pick<
  SemestersModel,
  'data' | 'setSemesterId' | 'navigate' | 'setEditing' | 'archive'
>;
export function SemestersTablePanel({
  data,
  setSemesterId,
  navigate,
  setEditing,
  archive,
}: SemestersTablePanelProps) {
  return (
    <Panel>
      <SemestersTable
        data={data}
        setSemesterId={setSemesterId}
        navigate={navigate}
        setEditing={setEditing}
        archive={archive}
      />
    </Panel>
  );
}
