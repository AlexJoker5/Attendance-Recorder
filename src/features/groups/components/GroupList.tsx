import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Panel } from '@/components/ui/Panel';
import { WEEKDAYS as weekdays } from '@/features/classes/const/scheduleDefaults';
import { ArrowRight, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { GroupsModel } from '../hooks/useGroupsPage';

export type GroupListProps = Pick<
  GroupsModel,
  'data' | 'semester' | 'search' | 'readonly' | 'setEditing' | 'setClassGroup'
>;
export function GroupList({
  data,
  semester,
  search,
  readonly,
  setEditing,
  setClassGroup,
}: GroupListProps) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6">
      {data.groups
        .filter(
          (group) =>
            group.semesterId === semester.id &&
            group.name.toLowerCase().includes(search.toLowerCase()),
        )
        .map((group) => (
          <Panel key={group.id}>
            <header className="page-heading mb-5">
              <div>
                <h2>{group.name}</h2>
                <p className="muted">
                  {data.enrollments.filter((item) => item.groupId === group.id).length}{' '}
                  {t('students')} {group.archived && <Badge>{t('Archived')}</Badge>}
                </p>
              </div>
              <div className="actions">
                <ButtonLink to={'/groups/' + group.id}>
                  {t('Open group')}
                  <ArrowRight size={16} />
                </ButtonLink>
                <Button disabled={readonly} onClick={() => setEditing(group)}>
                  {t('Edit group')}
                </Button>
                <Button
                  disabled={readonly || group.archived}
                  onClick={() => setClassGroup(group.id)}
                >
                  <Plus size={16} />
                  {t('Create class')}
                </Button>
              </div>
            </header>
            <div className="grid md:grid-cols-2 gap-4">
              {data.classes
                .filter((cls) => cls.groupId === group.id)
                .map((cls) => (
                  <Link key={cls.id} to={'/classes/' + cls.id} className="class-card">
                    <div className="actions justify-between">
                      <h3>{cls.name}</h3>
                      <ArrowRight size={17} />
                    </div>
                    <p className="muted mt-2">
                      {t(weekdays[cls.weekday])} · {cls.startTime}–{cls.endTime}
                    </p>
                    <p className="muted">
                      {cls.startDate} → {cls.endDate}
                    </p>
                    {cls.archived && <Badge>{t('Archived')}</Badge>}
                  </Link>
                ))}
              {!data.classes.some((cls) => cls.groupId === group.id) && (
                <p className="muted">
                  {t('No classes yet. Create a class to generate weekly sessions.')}
                </p>
              )}
            </div>
          </Panel>
        ))}
    </div>
  );
}
