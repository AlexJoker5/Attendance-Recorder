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
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TutorialIconType, TutorialTrackId, TutorialTrackInfo } from '../types/tutorialTypes';

interface Props {
  isOpen: boolean;
  tracks: TutorialTrackInfo[];
  activeTrackId: TutorialTrackId;
  onSelectTrack: (trackId: TutorialTrackId) => void;
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
  onSelectTrack,
  onDismiss,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

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
              {t('Interactive walkthroughs with tips, precautions, and live system guidance')}
            </p>
          </div>
        </div>

        <div className="tutorial-track-list">
          {tracks.map((track) => {
            const isCurrent = track.id === activeTrackId;
            return (
              <div
                key={track.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTrack(track.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTrack(track.id);
                  }
                }}
                className={`tutorial-track-item ${isCurrent ? 'is-active' : ''}`}
              >
                <div className="tutorial-track-icon">{renderTrackIcon(track.icon)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-slate-900">{t(track.title)}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {track.stepCount} {t('steps')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-1">{t(track.description)}</p>
                </div>
                <button
                  type="button"
                  className="tutorial-btn-secondary text-xs py-1.5 px-3 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrack(track.id);
                  }}
                >
                  {t('Start')}
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            {t('You can reopen this guide anytime from the top bar.')}
          </p>
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
