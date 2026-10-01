import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel } from '@/components/ui/Panel';
import { today } from '@/utils/dateUtils';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { DashboardModel } from '../hooks/useDashboard';

export type SessionsToReviewProps = Pick<DashboardModel, 'upcoming' | 'classes' | 'groups'>;
export function SessionsToReview({ upcoming, classes, groups }: SessionsToReviewProps) {
  const { t } = useTranslation();
  return (
    <Panel title={t('Sessions to review')}>
      {upcoming.map((session) => {
        const cls = classes.find((item) => item.id === session.classId)!;
        return (
          <Link className="session-shortcut" key={session.id} to={'/sessions/' + session.id}>
            <div>
              <strong>{cls.name}</strong>
              <small>
                {groups.find((group) => group.id === cls.groupId)?.name} · {session.date}
              </small>
            </div>
            <Badge tone={session.date <= today() ? 'warning' : 'neutral'}>
              {t(session.date <= today() ? 'Needs review' : 'Upcoming')}
            </Badge>
            <ArrowRight size={16} />
          </Link>
        );
      })}
      {!upcoming.length && <EmptyState>{t('No pending sessions.')}</EmptyState>}
    </Panel>
  );
}
