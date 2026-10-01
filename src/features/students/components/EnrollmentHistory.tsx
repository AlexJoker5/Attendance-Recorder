import { APP_TIME_ZONE } from '@/app/const/appConfig';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';

export type EnrollmentHistoryProps = Pick<StudentDetailsModel, 'enrollment'>;
export function EnrollmentHistory({ enrollment }: EnrollmentHistoryProps) {
  const { t } = useTranslation();
  return enrollment?.history.length ? (
    <div className="mt-6">
      <h3>{t('Enrollment history')}</h3>
      {enrollment.history
        .slice()
        .reverse()
        .map((item) => (
          <p className="mt-3" key={item.at}>
            {t(item.status)} ·{' '}
            {new Date(item.at).toLocaleString(undefined, { timeZone: APP_TIME_ZONE })}
            <small>{item.reason}</small>
          </p>
        ))}
    </div>
  ) : null;
}
