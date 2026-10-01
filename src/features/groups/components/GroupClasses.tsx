import { WEEKDAYS as weekdays } from '@/features/classes/const/scheduleDefaults';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';

export type GroupClassesProps = Pick<GroupDetailsModel, 'data' | 'group'>;
export function GroupClasses({ data, group }: GroupClassesProps) {
  const { t } = useTranslation();
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {data.classes
        .filter((cls) => cls.groupId === group.id)
        .map((cls) => (
          <Link key={cls.id} className="class-card" to={'/classes/' + cls.id}>
            <h2>{cls.name}</h2>
            <p className="muted mt-2">
              {t(weekdays[cls.weekday])} · {cls.startTime}–{cls.endTime}
            </p>
            <p className="muted">
              {cls.startDate} → {cls.endDate}
            </p>
          </Link>
        ))}
    </div>
  );
}
