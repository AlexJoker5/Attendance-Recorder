import { Compass, Sparkles, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onStart: () => void;
  onDismiss: () => void;
}

export function TutorialPromptModal({ isOpen, onStart, onDismiss }: Props) {
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
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          aria-label={t('Close')}
        >
          <X size={18} />
        </button>

        <div className="tutorial-celebration-badge">
          <Sparkles size={32} />
        </div>

        <span className="tutorial-badge mb-3">
          <Compass size={13} />
          {t('Quick Orientation Guide')}
        </span>

        <h2 id="tutorial-prompt-title" className="text-2xl font-bold text-white mb-2">
          {t('Welcome to Attendance Admin!')}
        </h2>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          {t(
            'Embark on a quick 1-minute guided tour to discover how to set up semesters, organize classes, manage students, and import Zoom attendance like a pro.',
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="tutorial-btn-primary w-full sm:w-auto justify-center text-sm py-2.5 px-6"
          >
            <Sparkles size={16} />
            {t('Start Quick Tour ✨')}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="tutorial-btn-secondary w-full sm:w-auto justify-center text-sm py-2.5 px-5"
          >
            {t('Skip for Now')}
          </button>
        </div>
      </div>
    </div>
  );
}
