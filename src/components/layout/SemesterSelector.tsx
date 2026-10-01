import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
export function SemesterSelector() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useAppData();
  const { semesterId, setSemesterId } = useWorkspace();
  const semester = data && selectedSemester(data, semesterId);
  return (
    <Select
      aria-label={t('Semester')}
      value={semester?.id || ''}
      onValueChange={(value) => {
        setSemesterId(value);
        navigate('/');
      }}
      options={
        data?.semesters.map((item) => ({
          value: item.id,
          label: (
            <>
              {item.name}
              {item.archived ? ' · ' + t('Archived') : ''}
            </>
          ),
        })) ?? []
      }
    />
  );
}
