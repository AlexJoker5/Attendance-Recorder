import { useAppData } from '@/app/hooks/useAppData';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { SessionEditor } from '../components/SessionEditor';
export default function SessionPage() {
  const { sessionId } = useParams();
  const { data } = useAppData();
  const session = data?.sessions.find((item) => item.id === sessionId);
  const { t } = useTranslation();
  if (!session) return <p>{t('Session not found.')}</p>;
  return <SessionEditor key={session.id} session={session} />;
}
