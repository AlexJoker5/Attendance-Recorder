import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeading } from '@/components/ui/PageHeading';
import { ArrowUpFromLine } from 'lucide-react';
import { AttendanceMatrixExport } from '../components/AttendanceMatrixExport';
import { AttendanceResultsPanel } from '../components/AttendanceResultsPanel';
import { ReportFilters } from '../components/ReportFilters';
import { useAttendanceReports } from '../hooks/useAttendanceReports';
export default function ReportsPage() {
  const model = useAttendanceReports();

  if (!model) return null;
  const {
    t,
    exportResults,
    error,
    group,
    setGroup,
    setClass,
    groups,
    cls,
    classes,
    result,
    setResult,
    semester,
    rows,
    matrixClass,
    setMatrixClass,
    exportMatrix,
  } = model;
  return (
    <>
      <PageHeading
        title={t('Reports')}
        description={t('Review attendance results and export the selected semester.')}
        actions={
          <>
            <Button onClick={() => void exportResults('csv')}>
              <ArrowUpFromLine size={16} />
              CSV
            </Button>
            <Button variant="primary" onClick={() => void exportResults('xlsx')}>
              <ArrowUpFromLine size={16} />
              XLSX
            </Button>
          </>
        }
      />
      {error && <ErrorState>{error}</ErrorState>}
      <ReportFilters
        group={group}
        setGroup={setGroup}
        setClass={setClass}
        groups={groups}
        cls={cls}
        classes={classes}
        result={result}
        setResult={setResult}
      />
      <AttendanceResultsPanel
        group={group}
        cls={cls}
        result={result}
        semester={semester}
        rows={rows}
      />
      <AttendanceMatrixExport
        matrixClass={matrixClass}
        classes={classes}
        setMatrixClass={setMatrixClass}
        exportMatrix={exportMatrix}
      />
    </>
  );
}
