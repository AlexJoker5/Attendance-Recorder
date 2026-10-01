import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageHeading } from '@/components/ui/PageHeading';
import { Panel } from '@/components/ui/Panel';
import { useTranslation } from 'react-i18next';

export function WorkspaceWelcome() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeading
        title={t('Welcome to Attendance Admin')}
        description={t('Your workspace is ready. Create your first semester to get started.')}
      />
      <Panel>
        <p>
          {t('Create a semester, add its groups and classes, then register and enroll students.')}
        </p>
        <ButtonLink className="mt-6" to="/semesters" variant="primary">
          {t('Create your first semester')}
        </ButtonLink>
      </Panel>
    </>
  );
}
