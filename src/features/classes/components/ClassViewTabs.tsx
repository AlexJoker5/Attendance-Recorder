import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';

export type ClassViewTabsProps = Pick<ClassDetailsModel, 'view' | 'setView'>;
export function ClassViewTabs({ view, setView }: ClassViewTabsProps) {
  const { t } = useTranslation();
  return (
    <div className="actions mb-6">
      <Button
        variant={view === 'sessions' ? 'primary' : 'secondary'}
        onClick={() => setView('sessions')}
      >
        {t('Sessions')}
      </Button>
      <Button
        variant={view === 'results' ? 'primary' : 'secondary'}
        onClick={() => setView('results')}
      >
        {t('Attendance overview')}
      </Button>
    </div>
  );
}
