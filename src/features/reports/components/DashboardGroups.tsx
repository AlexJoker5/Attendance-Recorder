import { ButtonLink } from '@/components/ui/ButtonLink';
import { Panel } from '@/components/ui/Panel';
import { WEEKDAYS as weekdays } from '@/features/classes/const/scheduleDefaults';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { DashboardModel } from '../hooks/useDashboard';

export type DashboardGroupsProps = Pick<DashboardModel, 'groups' | 'data' | 'classes'>;
export function DashboardGroups({ groups, data, classes }: DashboardGroupsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {groups.map((group) => (
        <Panel key={group.id}>
          <div className="actions justify-between mb-5">
            <div>
              <h2>{group.name}</h2>
              <p className="muted">
                {data.enrollments.filter((item) => item.groupId === group.id).length}{' '}
                {t('students')}
              </p>
            </div>
            <ButtonLink to={'/groups/' + group.id}>{t('Open group')}</ButtonLink>
          </div>
          {classes
            .filter((cls) => cls.groupId === group.id)
            .map((cls) => (
              <Link key={cls.id} to={'/classes/' + cls.id} className="session-shortcut">
                <div>
                  <strong>{cls.name}</strong>
                  <small>
                    {t(weekdays[cls.weekday])} · {cls.startTime}–{cls.endTime}
                  </small>
                </div>
                <ArrowRight size={16} />
              </Link>
            ))}
        </Panel>
      ))}
    </div>
  );
}
