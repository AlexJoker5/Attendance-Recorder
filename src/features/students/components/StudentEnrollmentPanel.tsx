import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { AttendancePolicyExplanation } from '@/features/attendance/components/AttendancePolicyExplanation';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';
import { EnrollmentHistory } from './EnrollmentHistory';
import { StudentResultsTable } from './StudentResultsTable';

export type StudentEnrollmentPanelProps = Pick<
  StudentDetailsModel,
  'semester' | 'enrollment' | 'data' | 'setAction' | 'rows'
>;
export function StudentEnrollmentPanel({
  semester,
  enrollment,
  data,
  setAction,
  rows,
}: StudentEnrollmentPanelProps) {
  const { t } = useTranslation();
  return (
    <Panel title={semester.name}>
      <div className="actions justify-between mb-6">
        <div>
          {enrollment ? (
            <>
              <strong>{data.groups.find((group) => group.id === enrollment.groupId)?.name}</strong>{' '}
              ·{' '}
              <Badge tone={enrollment.status === 'active' ? 'success' : 'danger'}>
                {t(enrollment.status)}
              </Badge>
              <p className="muted mt-2">
                {t('Enrollment date')}: {enrollment.joined}
              </p>
            </>
          ) : (
            <p>{t('Not enrolled')}</p>
          )}
        </div>
        <div className="actions">
          {!enrollment ? (
            <Button
              variant="primary"
              disabled={semester.archived}
              onClick={() => setAction('enroll')}
            >
              {t('Enroll student')}
            </Button>
          ) : enrollment.status === 'active' ? (
            <>
              <Button
                disabled={semester.archived}
                variant="danger"
                onClick={() => setAction('withdrawn')}
              >
                {t('Withdraw')}
              </Button>
              <Button disabled={semester.archived} onClick={() => setAction('transferred')}>
                {t('Transfer')}
              </Button>
            </>
          ) : (
            <Button disabled={semester.archived} onClick={() => setAction('active')}>
              {t('Reverse action')}
            </Button>
          )}
        </div>
      </div>
      <StudentResultsTable rows={rows} />
      <AttendancePolicyExplanation showLabel />
      <p className="muted mt-3">
        {t(
          'Pre-enrollment credits count as Present. Final results require class completion after all regular sessions are finalized.',
        )}
      </p>
      <EnrollmentHistory enrollment={enrollment} />
    </Panel>
  );
}
