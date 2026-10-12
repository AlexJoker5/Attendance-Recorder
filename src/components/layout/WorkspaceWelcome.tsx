import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageHeading } from '@/components/ui/PageHeading';
import { Panel } from '@/components/ui/Panel';
import { useTutorial } from '@/features/tutorial/context/TutorialContext';
import { Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function WorkspaceWelcome() {
  const { t } = useTranslation();
  const { openGuideHub } = useTutorial();
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
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink to="/semesters" variant="primary">
            {t('Create your first semester')}
          </ButtonLink>
          <Button onClick={openGuideHub} variant="secondary">
            <Compass size={16} />
            {t('Tutorial Guides')}
          </Button>
        </div>
      </Panel>
    </>
  );
}
