import type { DashboardModel } from '../hooks/useDashboard';
import { AttendanceStatisticsPanel } from './AttendanceStatisticsPanel';
import { SessionsToReview } from './SessionsToReview';

export type DashboardAttendanceOverviewProps = Pick<
  DashboardModel,
  'results' | 'upcoming' | 'classes' | 'groups'
>;
export function DashboardAttendanceOverview({
  results,
  upcoming,
  classes,
  groups,
}: DashboardAttendanceOverviewProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <AttendanceStatisticsPanel results={results} />
      <SessionsToReview upcoming={upcoming} classes={classes} groups={groups} />
    </div>
  );
}
