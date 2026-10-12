import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  TutorialIconType,
  TutorialProgress,
  TutorialTrackId,
  TutorialTrackInfo,
} from '../types/tutorialTypes';

interface Props {
  isOpen: boolean;
  tracks: TutorialTrackInfo[];
  activeTrackId: TutorialTrackId;
  progress: TutorialProgress;
  onResumeTour: () => void;
  onSelectTrack: (trackId: TutorialTrackId, stepIdx?: number) => void;
  onSkipAll: () => void;
  onDismiss: () => void;
}

function renderTrackIcon(icon: TutorialIconType) {
  switch (icon) {
    case 'calendar':
      return <Calendar size={20} />;
    case 'layers':
      return <Layers size={20} />;
    case 'file-spreadsheet':
      return <FileSpreadsheet size={20} />;
    case 'clock':
      return <Clock size={20} />;
    case 'check-circle':
      return <CheckCircle2 size={20} />;
    case 'file':
      return <FileText size={20} />;
    case 'users':
      return <Users size={20} />;
    case 'book':
      return <BookOpen size={20} />;
    case 'alert-triangle':
      return <AlertTriangle size={20} />;
    default:
      return <Sparkles size={20} />;
  }
}

export function TutorialPromptModal({
  isOpen,
  tracks,
  activeTrackId,
  progress,
  onResumeTour,
  onSelectTrack,
  onSkipAll,
  onDismiss,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  // Identify leftover track to resume
  const resumeTrackId = progress.activeTrackId || activeTrackId || 'overview';
  const resumeTrackInfo = tracks.find((tr) => tr.id === resumeTrackId) ?? tracks[0];
  const resumeStepIdx = progress.stepIndices[resumeTrackId] ?? 0;
  const isResumeTrackCompleted = progress.completedTracks.includes(resumeTrackId);
  const hasLeftover =
    !progress.isAllCompleted &&
    (!isResumeTrackCompleted || progress.completedTracks.length < tracks.length);

  return (
    <div
      className="tutorial-prompt-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-prompt-title"
    >
      <div className="tutorial-prompt-content">
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
          aria-label={t('Close')}
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="tutorial-track-icon">
            <Compass size={22} />
          </div>
          <div>
            <h2 id="tutorial-prompt-title" className="text-xl font-bold text-slate-900 leading-tight">
              {t('Tutorial & Step-by-Step Guides')}
            </h2>
            <p className="text-slate-500 text-xs">
              {t('Your learning progress is saved. Pick up where you left off or start any topic.')}
            </p>
          </div>
        </div>

        {/* Leftover Progress Banner */}
        {hasLeftover && (
          <div className="my-3 p-3.5 rounded-14 bg-indigo-50 border border-indigo-100 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block mb-0.5">
                {t('Continue Leftover Guide')}
              </span>
              <p className="text-sm font-bold text-slate-900 truncate">
                {t(resumeTrackInfo.title)}
              </p>
              <p className="text-xs text-indigo-600">
                {t('Step')} {resumeStepIdx + 1} {t('of')} {resumeTrackInfo.stepCount}
              </p>
            </div>
            <button
              type="button"
              onClick={onResumeTour}
              className="tutorial-btn-primary text-xs py-2 px-4 shrink-0"
            >
              <Play size={13} />
              {t('Resume')}
            </button>
          </div>
        )}

        <div className="tutorial-track-list">
          {tracks.map((track) => {
            const isCompleted = progress.completedTracks.includes(track.id);
            const savedStep = progress.stepIndices[track.id] ?? 0;
            const hasStarted = !isCompleted && savedStep > 0;
            const isCurrent = track.id === activeTrackId;

            return (
              <div
                key={track.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTrack(track.id, isCompleted ? 0 : savedStep)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTrack(track.id, isCompleted ? 0 : savedStep);
                  }
                }}
                className={`tutorial-track-item ${isCurrent ? 'is-active' : ''}`}
              >
                <div className="tutorial-track-icon">{renderTrackIcon(track.icon)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900">{t(track.title)}</span>
                    {isCompleted ? (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        {t('Completed')}
                      </span>
                    ) : hasStarted ? (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {t('In Progress')} · {savedStep + 1}/{track.stepCount}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {track.stepCount} {t('steps')}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-1">{t(track.description)}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {hasStarted && (
                    <button
                      type="button"
                      title={t('Restart topic from step 1')}
                      onClick={() => onSelectTrack(track.id, 0)}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded transition-colors"
                    >
                      <RotateCcw size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="tutorial-btn-secondary text-xs py-1.5 px-3 flex-shrink-0"
                    onClick={() => onSelectTrack(track.id, isCompleted ? 0 : savedStep)}
                  >
                    {isCompleted ? t('Review') : hasStarted ? t('Resume') : t('Start')}
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
          <button
            type="button"
            onClick={onSkipAll}
            className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors"
          >
            {t('Skip whole tutorial')}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="tutorial-btn-secondary text-xs py-1.5 px-4"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
