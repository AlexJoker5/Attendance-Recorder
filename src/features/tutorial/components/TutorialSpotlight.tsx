import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Layers,
  Lightbulb,
  SkipForward,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TUTORIAL_TRACKS } from '../const/tutorialSteps';
import { TRACK_ORDER } from '../context/TutorialContext';
import type { TutorialIconType, TutorialStep, TutorialTrackId } from '../types/tutorialTypes';

interface Props {
  isActive: boolean;
  step: TutorialStep | null;
  stepIndex: number;
  totalSteps: number;
  activeTrackId: TutorialTrackId;
  onNext: () => void;
  onPrev: () => void;
  onSkipTrack: () => void;
  onSkipAll: () => void;
  onOpenGuideHub?: () => void;
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
      return <FileText size={20} />;
    case 'file-spreadsheet':
      return <FileSpreadsheet size={20} />;
    case 'layers':
      return <Layers size={20} />;
    case 'clock':
      return <Clock size={20} />;
    case 'check-circle':
      return <CheckCircle2 size={20} />;
    case 'alert-triangle':
      return <AlertTriangle size={20} />;
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
  activeTrackId,
  onNext,
  onPrev,
  onSkipTrack,
  onSkipAll,
  onOpenGuideHub,
}: Props) {
  const { t } = useTranslation();
  const [targetRect, setTargetRect] = useState<RectState | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({ top: 100, left: 100 });
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  // Topic context
  const currentTopicIdx = Math.max(0, TRACK_ORDER.indexOf(activeTrackId));
  const currentTrackInfo = TUTORIAL_TRACKS.find((tr) => tr.id === activeTrackId);
  const nextTrackId = TRACK_ORDER[currentTopicIdx + 1];
  const nextTrackInfo = nextTrackId ? TUTORIAL_TRACKS.find((tr) => tr.id === nextTrackId) : null;

  // Update target rect & card placement
  useLayoutEffect(() => {
    if (!isActive || !step) return;
    let frame: number | null = null;

    function calculatePosition() {
      if (!step?.targetSelector) {
        setTargetRect(null);
        // Center card in viewport
        const cardWidth = Math.min(480, window.innerWidth - 32);
        const cardHeight = 390;
        setCardPos({
          left: Math.max(16, (window.innerWidth - cardWidth) / 2),
          top: Math.max(20, (window.innerHeight - cardHeight) / 2),
        });
        return;
      }

      const element = document.querySelector<HTMLElement>(step.targetSelector);
      if (!element) {
        // Fallback to center if element not currently in DOM
        setTargetRect(null);
        const cardWidth = Math.min(480, window.innerWidth - 32);
        setCardPos({
          left: Math.max(16, (window.innerWidth - cardWidth) / 2),
          top: Math.max(40, (window.innerHeight - 390) / 2),
        });
        return;
      }

      const b = element.getBoundingClientRect();
      const padding = 6;
      const rect: RectState = {
        x: Math.max(0, b.left - padding),
        y: Math.max(0, b.top - padding),
        width: b.width + padding * 2,
        height: b.height + padding * 2,
      };
      setTargetRect(rect);

      const cardWidth = Math.min(480, window.innerWidth - 32);
      const cardHeight = 390;
      let left: number;
      let top: number;

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

    // Measure after DOM updates and coalesce smooth-scroll/resize events into one frame.
    function schedulePosition() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        calculatePosition();
      });
    }

    if (step.targetSelector) {
      document.querySelector<HTMLElement>(step.targetSelector)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
    schedulePosition();
    window.addEventListener('resize', schedulePosition);
    window.addEventListener('scroll', schedulePosition, true);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedulePosition);
      window.removeEventListener('scroll', schedulePosition, true);
    };
  }, [isActive, step]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowSkipConfirm(true);
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
  }, [isActive, onNext, onPrev]);

  if (!isActive || !step) return null;

  const isLastStep = stepIndex === totalSteps - 1;
  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);

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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="tutorial-badge">
              <Sparkles size={11} />
              {t('Topic')} {currentTopicIdx + 1}/{TRACK_ORDER.length} · {t(step.questBadge)}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {stepIndex + 1} / {totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenGuideHub && (
              <button
                type="button"
                onClick={onOpenGuideHub}
                className="text-xs text-brand hover:text-indigo-800 font-medium px-2 py-1 rounded transition-colors flex items-center gap-1"
                title={t('View all guides & saved progress')}
              >
                <Compass size={13} />
                <span className="hidden sm:inline">{t('All Guides')}</span>
              </button>
            )}

            {/* Skip This Topic Button */}
            <button
              type="button"
              onClick={onSkipTrack}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded transition-colors flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200"
              title={t('Skip this topic and move to next')}
            >
              <SkipForward size={12} />
              <span>{t('Skip topic')}</span>
            </button>

            {/* Skip Whole Tutorial Button (X) */}
            <button
              type="button"
              onClick={() => setShowSkipConfirm(true)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
              aria-label={t('Exit tutorial')}
              title={t('Exit / Skip the tutorial')}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="tutorial-progress-track mb-4">
          <div className="tutorial-progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Modal Prompt if User clicked Exit / Escape */}
        {showSkipConfirm ? (
          <div className="py-2 text-center">
            <div className="tutorial-celebration-badge mx-auto mb-3 bg-amber-50 text-amber-600 border-amber-200">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">{t('Leave tutorial?')}</h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {t(
                'Your progress is automatically saved! You can resume leftover tutorials anytime from the top bar.',
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowSkipConfirm(false);
                  onSkipTrack();
                }}
                className="tutorial-btn-secondary text-xs justify-center py-2 px-3"
              >
                <SkipForward size={13} />
                {t('Skip just this topic')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSkipConfirm(false);
                  onSkipAll();
                }}
                className="tutorial-btn-secondary text-xs justify-center py-2 px-3 text-red-600 border-red-200 hover:bg-red-50"
              >
                {t('Skip the tutorial')}
              </button>
              <button
                type="button"
                onClick={() => setShowSkipConfirm(false)}
                className="tutorial-btn-primary text-xs justify-center py-2 px-4"
              >
                {t('Continue learning')}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Icon & Title */}
            <div className="flex items-start gap-3 mb-3">
              <div className="tutorial-mascot">
                <StepIcon icon={step.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-snug text-slate-900">{t(step.title)}</h3>
                <p className="text-xs text-brand font-medium">
                  {currentTrackInfo ? t(currentTrackInfo.title) : t('Interactive Step-by-Step')}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed mb-4 whitespace-pre-line">
              {t(step.description)}
            </p>

            {/* Caution Notice (for traps like column names, header rows, date bounds) */}
            {step.caution && (
              <div className="tutorial-caution-box mb-4">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed whitespace-pre-line">
                  <strong className="block font-semibold mb-0.5">
                    {t('Pay Special Attention:')}
                  </strong>
                  {t(step.caution)}
                </div>
              </div>
            )}

            {/* Tip Box */}
            {step.tip && (
              <div className="tutorial-tip-box mb-5">
                <Lightbulb size={15} className="text-brand shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed whitespace-pre-line">{t(step.tip)}</div>
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

              {/* Step dots */}
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === stepIndex ? 'w-5 bg-brand' : 'w-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onNext}
                  className="tutorial-btn-primary"
                  title={t('Next (Right Arrow or Enter)')}
                >
                  {isLastStep ? (
                    nextTrackInfo ? (
                      <>
                        <span>
                          {t('Next Topic')}: {t(nextTrackInfo.title)}
                        </span>
                        <ArrowRight size={15} />
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>{t('Finish All Tutorials')}</span>
                      </>
                    )
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
        )}
      </div>
    </>
  );
}
