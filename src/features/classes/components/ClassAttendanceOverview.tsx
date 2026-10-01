import { Panel } from '@/components/ui/Panel';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';
import { ClassResultsTable } from './ClassResultsTable';
import { ClassSessionsTable } from './ClassSessionsTable';
import { SessionFilters } from './SessionFilters';

export type ClassAttendanceOverviewProps = Pick<
  ClassDetailsModel,
  | 'restoreClassSession'
  | 'requestRemoveClassSession'
  | 'isRemovingSession'
  | 'view'
  | 'state'
  | 'setState'
  | 'type'
  | 'setType'
  | 'from'
  | 'setFrom'
  | 'to'
  | 'setTo'
  | 'rows'
  | 'readonly'
  | 'results'
>;
export function ClassAttendanceOverview({
  restoreClassSession,
  requestRemoveClassSession,
  isRemovingSession,
  view,
  state,
  setState,
  type,
  setType,
  from,
  setFrom,
  to,
  setTo,
  rows,
  readonly,
  results,
}: ClassAttendanceOverviewProps) {
  const { t } = useTranslation();
  return view === 'sessions' ? (
    <>
      <SessionFilters
        state={state}
        setState={setState}
        type={type}
        setType={setType}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
      />
      <Panel>
        <ClassSessionsTable
          restoreClassSession={restoreClassSession}
          requestRemoveClassSession={requestRemoveClassSession}
          isRemovingSession={isRemovingSession}
          state={state}
          type={type}
          from={from}
          to={to}
          rows={rows}
          readonly={readonly}
        />
      </Panel>
    </>
  ) : (
    <Panel>
      <ClassResultsTable results={results} />
      <p className="muted mt-5">{t('Edit attendance on the individual session page.')}</p>
    </Panel>
  );
}
