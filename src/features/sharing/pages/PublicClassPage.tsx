import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/table/DataTable';
import { publicSessionsColumns } from '../tables/publicColumns';
import type { PublicClass } from '../types/sharingTypes';

export function PublicClassPage({ data, token }: { data: PublicClass; token: string }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2>
          {t('Finalized sessions')} <span className="muted">({data.sessions.length})</span>
        </h2>
        <p className="muted">
          {t(
            'Open a session to check attendance and remarks. Extra sessions do not count toward attendance.',
          )}
        </p>
        {data.sessions.length ? (
          <DataTable
            data={data.sessions}
            columns={publicSessionsColumns(token, t)}
            showCreatedDate={false}
          />
        ) : (
          <p className="panel">{t('No finalized sessions have been published yet.')}</p>
        )}
      </section>
    </div>
  );
}
