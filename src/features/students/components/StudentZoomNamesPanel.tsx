import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Panel } from '@/components/ui/Panel';
import { RecordForm } from '@/components/ui/RecordForm';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';
import { zoomNameSchema } from '../schemas/zoomNameSchema';

export function StudentZoomNamesPanel({
  student,
  addZoomName,
  removeZoomName,
  namesReady,
}: Pick<StudentDetailsModel, 'student' | 'addZoomName' | 'removeZoomName' | 'namesReady'>) {
  const { t } = useTranslation();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  return (
    <Panel title={t('Approved Zoom names')} className="mb-6">
      <p className="muted mb-5">
        {t(
          'These names match automatically in future imports. Removing a saved name stops future matching without changing past attendance.',
        )}
      </p>
      {!namesReady && (
        <p className="callout warning mb-5">
          {t(
            'Install supabase/009_zoom_name_matching.sql before importing attendance or saving Zoom names.',
          )}
        </p>
      )}
      <div className="actions mb-5">
        <Button disabled={!namesReady} onClick={() => setAdding(true)}>
          <Plus size={16} />
          {t('Add Zoom name')}
        </Button>
      </div>
      {(student.zoomNames || []).map((name) => (
        <div key={name} className="actions justify-between mb-3 gap-4">
          <span className="break-words">{name}</span>
          <Button
            disabled={removing}
            onClick={async () => {
              setRemoving(true);
              try {
                await removeZoomName(name);
              } finally {
                setRemoving(false);
              }
            }}
          >
            {t('Remove')}
          </Button>
        </div>
      ))}
      {!student.zoomNames?.length && <p className="muted">{t('No approved Zoom names yet.')}</p>}
      {adding && (
        <Dialog title={t('Add Zoom name')} onClose={() => setAdding(false)} isFooter={false}>
          <p className="muted mb-5">
            {t(
              'Approve a personal Zoom name for future imports. The registered name stays unchanged.',
            )}
          </p>
          <RecordForm
            schema={zoomNameSchema}
            defaults={{ name: '' }}
            fields={[{ name: 'name', label: 'Zoom name', type: 'text' }]}
            label="Create"
            onSave={async (values) => {
              await addZoomName(values);
              setAdding(false);
            }}
          />
        </Dialog>
      )}
    </Panel>
  );
}
