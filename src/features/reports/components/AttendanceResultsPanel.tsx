import { Panel } from '@/components/ui/Panel';
import { AttendancePolicyExplanation } from '@/features/attendance/components/AttendancePolicyExplanation';
import type { ReportsModel } from '../hooks/useAttendanceReports';
import { AttendanceResultsTable } from './AttendanceResultsTable';

export type AttendanceResultsPanelProps = Pick<
  ReportsModel,
  'group' | 'cls' | 'result' | 'semester' | 'rows'
>;
export function AttendanceResultsPanel({
  group,
  cls,
  result,
  semester,
  rows,
}: AttendanceResultsPanelProps) {
  return (
    <Panel>
      <AttendanceResultsTable
        group={group}
        cls={cls}
        result={result}
        semester={semester}
        rows={rows}
      />
      <AttendancePolicyExplanation />
    </Panel>
  );
}
