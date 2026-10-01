import { cn } from '@/lib/cn';
import { useTranslation } from 'react-i18next';
import {
  MAX_APPROVED_LEAVES_PER_CLASS,
  MINIMUM_ATTENDANCE_PERCENTAGE,
} from '../const/attendancePolicy';
export function AttendancePolicyExplanation({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <p className={cn('callout mt-5', className)}>
      {showLabel && <>{t('How attendance is calculated')}: </>}
      {t(
        'Present ÷ (Present + Absent + Leave) × 100. At least {{minimum}}% is required. More than {{leaves}} approved leaves fails the class. Extra, removed, and draft sessions are excluded.',
        { minimum: MINIMUM_ATTENDANCE_PERCENTAGE, leaves: MAX_APPROVED_LEAVES_PER_CLASS },
      )}
    </p>
  );
}
