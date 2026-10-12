import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileDown,
  Lightbulb,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import type { TutorialIconType, TutorialStep } from '../types/tutorialTypes';

interface Props {
  isActive: boolean;
  step: TutorialStep | null;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

interface RectState {
  x: number;
  y: number;
  width: number;
  height: number;
}

function StepIcon({ icon }: { icon?: TutorialIconType }) {
  switch (icon) {
    case 'calendar':
      return <CalendarDays size={20} />;
    case 'book':
      return <BookOpen size={20} />;
    case 'users':
      return <Users size={20} />;
    case 'file':
      return <FileDown size={20} />;
    case 'user':
      return <User size={20} />;
    case 'trophy':
      return <Trophy size={22} />;
    case 'sparkles':
    default:
      return <Sparkles size={20} />;
  }
}

export function TutorialSpotlight({
  isActive,
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [targetRect, setTargetRect] = useState<RectState | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({ top: 100, left: 100 });

  // Update target rect & card placement
  useLayoutEffect(() => {
    if (!isActive || !step) {
      setTargetRect(null);
      return;
    }

    function calculatePosition() {
      if (!step?.targetSelector) {
        setTargetRect(null);
        // Center card in viewport
        const cardWidth = Math.min(440, window.innerWidth - 32);
        const cardHeight = 360;
        setCardPos({
          left: Math.max(16, (window.innerWidth - cardWidth) / 2),
          top: Math.max(20, (window.innerHeight - cardHeight) / 2),
        });
        return;
      }

      const element = document.querySelector<HTMLElement>(step.targetSelector);
      if (!element) {
        // Fallback to center if element not in DOM
        setTargetRect(null);
        const cardWidth = Math.min(440, window.innerWidth - 32);
        setCardPos({
          left: Math.max(16, (window.innerWidth - cardWidth) / 2),
          top: Math.max(40, (window.innerHeight - 380) / 2),
        });
        return;
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const b = element.getBoundingClientRect();
      const padding = 6;
      const rect: RectState = {
        x: Math.max(0, b.left - padding),
        y: Math.max(0, b.top - padding),
        width: b.width + padding * 2,
        height: b.height + padding * 2,
      };
      setTargetRect(rect);

      const cardWidth = Math.min(440, window.innerWidth - 32);
      const cardHeight = 380;
      let left = 16;
      let top = 16;

      const placement = window.innerWidth < 768 ? 'bottom' : step.placement;

      switch (placement) {
        case 'right': {
          left = rect.x + rect.width + 16;
          top = rect.y + rect.height / 2 - 140;
          if (left + cardWidth > window.innerWidth - 16) {
            left = Math.max(16, rect.x);
            top = rect.y + rect.height + 16;
          }
          break;
        }
        case 'bottom': {
          left = rect.x + rect.width / 2 - cardWidth / 2;
          top = rect.y + rect.height + 16;
          break;
        }
        case 'top': {
          left = rect.x + rect.width / 2 - cardWidth / 2;
          top = rect.y - cardHeight - 16;
          break;
        }
        case 'left': {
          left = rect.x - cardWidth - 16;
          top = rect.y + rect.height / 2 - 140;
          break;
        }
        case 'center':
        default: {
          left = (window.innerWidth - cardWidth) / 2;
          top = (window.innerHeight - cardHeight) / 2;
          break;
        }
      }

      // Bound within viewport safely
      left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));
      top = Math.max(16, Math.min(window.innerHeight - cardHeight - 16, top));

      setCardPos({ top, left });
    }

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isActive, step]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onSkip();
      } else if (event.key === 'ArrowRight' || (event.key === 'Enter' && !event.shiftKey)) {
        event.preventDefault();
        onNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onNext, onPrev, onSkip]);

  if (!isActive || !step) return null;

  const isLastStep = stepIndex === totalSteps - 1;
  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);

  const handleFinishAction = () => {
    onNext();
    if (isLastStep) {
      navigate('/semesters');
    }
  };

  return (
    <>
      {/* SVG Backdrop with Cutout Spotlight */}
      <svg className="tutorial-overlay-svg" aria-hidden="true">
        <defs>
          <mask id="tutorial-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.x}
                y={targetRect.y}
                width={targetRect.width}
                height={targetRect.height}
                rx="10"
                ry="10"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.65)"
          mask="url(#tutorial-spotlight-mask)"
        />
      </svg>

      {/* Ring over Target Element */}
      {targetRect && (
        <div
          className="tutorial-spotlight-ring"
          style={{
            top: targetRect.y,
            left: targetRect.x,
            width: targetRect.width,
            height: targetRect.height,
          }}
          aria-hidden="true"
        />
      )}

      {/* Quest Dialogue Card */}
      <div
        className="tutorial-card"
        style={{ top: `${cardPos.top}px`, left: `${cardPos.left}px` }}
        role="region"
        aria-label={t('Tutorial Quest Guide')}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="tutorial-badge">
              <Sparkles size={11} />
              {t(step.questBadge)}
            </span>
            <span className="text-xs font-semibold text-muted">
              {stepIndex + 1} / {totalSteps}
            </span>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            aria-label={t('Skip tutorial')}
            title={t('Skip tutorial (Esc)')}
          >
            <X size={17} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="tutorial-progress-track mb-4">
          <div className="tutorial-progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="tutorial-mascot">
            <StepIcon icon={step.icon} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-snug">{t(step.title)}</h3>
            <p className="text-xs text-brand font-medium">
              {isLastStep ? t('Orientation Complete') : t('Interactive Walkthrough')}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed mb-4">{t(step.description)}</p>

        {/* Tip */}
        {step.tip && (
          <div className="tutorial-tip-box mb-5">
            <Lightbulb size={15} className="text-brand shrink-0 mt-0.5" />
            <span>{t(step.tip)}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onPrev}
            disabled={stepIndex === 0}
            className="tutorial-btn-secondary"
            title={t('Previous (Left Arrow)')}
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">{t('Back')}</span>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIndex
                    ? 'w-5 bg-brand'
                    : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleFinishAction}
            className="tutorial-btn-primary"
            title={t('Next (Right Arrow or Enter)')}
          >
            {isLastStep ? (
              <>
                <CheckCircle2 size={16} />
                <span>{t('Get Started')}</span>
              </>
            ) : (
              <>
                <span>{t('Next')}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
