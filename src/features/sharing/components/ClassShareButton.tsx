import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { ClassShareDialog } from './ClassShareDialog';

export function ClassShareButton({ classId }: { classId: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Share2 size={16} />
        {t('Share class')}
      </Button>
      {open && <ClassShareDialog classId={classId} onClose={() => setOpen(false)} />}
    </>
  );
}
