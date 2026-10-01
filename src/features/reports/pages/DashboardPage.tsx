import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeading } from '@/components/ui/PageHeading';
import { Panel } from '@/components/ui/Panel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowRight } from 'lucide-react';
import { DashboardAttendanceOverview } from '../components/DashboardAttendanceOverview';
import { DashboardGroups } from '../components/DashboardGroups';
import { DashboardStats } from '../components/DashboardStats';
import { useDashboard } from '../hooks/useDashboard';
export default function DashboardPage() {
  const model = useDashboard();

  if (!model) return null;
  const { t, semester, stats, results, upcoming, classes, groups, data } = model;
  return (
    <>
      <PageHeading
        title={t('Overview')}
        description={semester.name + ' · ' + semester.start + ' → ' + semester.end}
        actions={
          <ButtonLink className="primary" to="/groups">
            {t('Manage groups & classes')}
            <ArrowRight size={16} />
          </ButtonLink>
        }
      />
      <DashboardStats stats={stats} />
      <DashboardAttendanceOverview
        results={results}
        upcoming={upcoming}
        classes={classes}
        groups={groups}
      />
      <SectionHeading title={t('Your groups')} />
      <DashboardGroups groups={groups} data={data} classes={classes} />
      {!groups.length && (
        <Panel>
          <EmptyState>{t('No groups yet. Create a fresh group for this semester.')}</EmptyState>
        </Panel>
      )}
    </>
  );
}
