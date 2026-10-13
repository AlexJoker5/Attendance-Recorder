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
import { TRACK_ORDER } from '../context/TutorialContext';
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

  const totalTracks = tracks.length;
  const completedCount = progress.completedTracks.length;
  const overallPercent = Math.round((completedCount / totalTracks) * 100);

  // Identify next uncompleted track
  let nextTrackId = progress.activeTrackId || 'overview';
  if (progress.completedTracks.includes(nextTrackId)) {
    const nextInLine = TRACK_ORDER.find((tr) => !progress.completedTracks.includes(tr));
    if (nextInLine) nextTrackId = nextInLine;
  }
  const nextTrackInfo = tracks.find((tr) => tr.id === nextTrackId) ?? tracks[0];
  const nextTrackSavedStep = progress.stepIndices[nextTrackId] ?? 0;
  const hasUncompleted = completedCount < totalTracks;

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

        {/* Title Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="tutorial-track-icon">
            <Compass size={22} />
          </div>
          <div>
            <h2 id="tutorial-prompt-title" className="text-xl font-bold text-slate-900 leading-tight">
              {t('Tutorial & Step-by-Step Guides')}
            </h2>
            <p className="text-slate-500 text-xs">
              {t('Interactive walkthroughs with live system guidance and progress tracking')}
            </p>
          </div>
        </div>

        {/* OVERALL PROGRESS CARD */}
        <div className="my-3 p-4 rounded-14 bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {t('Your Learning Progress')}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {completedCount} / {totalTracks} {t('topics completed')}
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-600">
              {overallPercent}%
            </span>
          </div>

          {/* Overall Progress Bar */}
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                overallPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${overallPercent}%` }}
            />
          </div>

          {/* Quick Resume Action Banner */}
          {hasUncompleted ? (
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  {t('Next Recommended Topic')}
                </span>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {t(nextTrackInfo.title)}
                </p>
                <p className="text-[11px] text-indigo-600">
                  {nextTrackSavedStep > 0
                    ? `${t('Resume at Step')} ${nextTrackSavedStep + 1} ${t('of')} ${nextTrackInfo.stepCount}`
                    : `${nextTrackInfo.stepCount} ${t('steps remaining')}`}
                </p>
              </div>

              <button
                type="button"
                onClick={onResumeTour}
                className="tutorial-btn-primary text-xs py-2 px-4 shrink-0 shadow-sm"
              >
                <Play size={12} />
                <span>
                  {nextTrackSavedStep > 0 ? t('Resume Tutorial') : t('Continue Tutorial')}
                </span>
              </button>
            </div>
          ) : (
            <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={15} />
              <span>{t('Congratulations! You have completed all tutorial topics.')}</span>
            </div>
          )}
        </div>

        {/* TOPIC TRACK LIST WITH DETAILED PROGRESS */}
        <div className="tutorial-track-list">
          {tracks.map((track) => {
            const isCompleted = progress.completedTracks.includes(track.id);
            const savedStep = progress.stepIndices[track.id] ?? 0;
            const hasStarted = !isCompleted && savedStep > 0;
            const isCurrent = track.id === activeTrackId;
            const trackProgressPercent = isCompleted
              ? 100
              : hasStarted
              ? Math.round(((savedStep + 1) / track.stepCount) * 100)
              : 0;

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
                className={`tutorial-track-item relative overflow-hidden ${
                  isCurrent ? 'is-active' : ''
                } ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : ''}`}
              >
                <div
                  className={`tutorial-track-icon ${
                    isCompleted ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : ''
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : renderTrackIcon(track.icon)}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900">{t(track.title)}</span>

                    {/* Progress pill on card */}
                    {isCompleted ? (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        {t('Completed')} ({track.stepCount}/{track.stepCount})
                      </span>
                    ) : hasStarted ? (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {t('In Progress')} · {savedStep + 1}/{track.stepCount} ({trackProgressPercent}%)
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {t('Not Started')} · 0/{track.stepCount}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-1">{t(track.description)}</p>
                </div>

                {/* Action buttons */}
                <div
                  className="flex items-center gap-1.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
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
                    className={`text-xs py-1.5 px-3 flex-shrink-0 ${
                      isCompleted
                        ? 'tutorial-btn-secondary text-slate-600'
                        : hasStarted
                        ? 'tutorial-btn-primary'
                        : 'tutorial-btn-secondary'
                    }`}
                    onClick={() => onSelectTrack(track.id, isCompleted ? 0 : savedStep)}
                  >
                    {isCompleted ? (
                      <>
                        <span>{t('Review')}</span>
                        <RotateCcw size={12} />
                      </>
                    ) : hasStarted ? (
                      <>
                        <span>{t('Resume')}</span>
                        <Play size={12} />
                      </>
                    ) : (
                      <>
                        <span>{t('Start')}</span>
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>
                </div>

                {/* Mini Progress Bar Line on Card Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${trackProgressPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
          <button
            type="button"
            onClick={onSkipAll}
            className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors"
          >
            {t('Skip the tutorial')}
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
