import { useTranslation } from 'react-i18next';
import type { ClassFormModel } from '../hooks/useClassForm';
import { weeklyDates } from '../lib/weeklyDates';

export type ScheduleChangePreviewProps = Pick<ClassFormModel, 'review' | 'existing' | 'plan'>;
export function ScheduleChangePreview({ review, existing, plan }: ScheduleChangePreviewProps) {
  const { t } = useTranslation();
  return (
    review && (
      <div className="callout">
        <strong>{t('Review schedule changes')}</strong>
        {existing && plan ? (
          [
            ['Add new sessions', plan.add],
            ['Remove unused generated sessions', plan.remove.map((session) => session.date)],
            ['Retain attendance and manual sessions', plan.retain.map((session) => session.date)],
            ['Keep manually removed dates excluded', plan.skip.map((session) => session.date)],
            [
              'Restore dates removed by an earlier schedule change',
              plan.restore.map((session) => session.date),
            ],
          ].map(([label, dates]) => (
            <div className="mt-4" key={String(label)}>
              <strong>
                {t(String(label))} ({dates.length})
              </strong>
              <p className="muted break-words">
                {typeof dates !== 'string' ? dates.join(' · ') || t('None') : dates}
              </p>
            </div>
          ))
        ) : (
          <p>
            {
              weeklyDates(review.values.startDate, review.values.endDate, review.values.weekday)
                .length
            }{' '}
            {t('weekly sessions')}
            <br />
            {weeklyDates(
              review.values.startDate,
              review.values.endDate,
              review.values.weekday,
            ).join(' · ')}
          </p>
        )}
      </div>
    )
  );
}
