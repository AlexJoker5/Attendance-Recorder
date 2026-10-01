import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';

export type ClassLifecycleActionsProps = Pick<
  ClassDetailsModel,
  'readonly' | 'cls' | 'canComplete' | 'setDialog' | 'semester' | 'group' | 'all'
>;
export function ClassLifecycleActions({
  readonly,
  cls,
  canComplete,
  setDialog,
  semester,
  group,
  all,
}: ClassLifecycleActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="actions mt-6">
      <Button
        disabled={readonly || (!cls.completed && !canComplete)}
        onClick={() => setDialog('complete')}
      >
        {t(cls.completed ? 'Reopen class' : 'Complete class')}
      </Button>
      <Button disabled={semester.archived || group.archived} onClick={() => setDialog('archive')}>
        {t(cls.archived ? 'Restore class' : all.length ? 'Archive class' : 'Delete class')}
      </Button>
    </div>
  );
}
