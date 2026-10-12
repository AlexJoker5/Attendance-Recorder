import { localMode, supabase } from '@/lib/supabase';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { TutorialPromptModal } from '../components/TutorialPromptModal';
import { TutorialSpotlight } from '../components/TutorialSpotlight';
import { TUTORIAL_STEPS_BY_TRACK, TUTORIAL_TRACKS } from '../const/tutorialSteps';
import type {
  TutorialContextValue,
  TutorialProgress,
  TutorialStep,
  TutorialTrackId,
} from '../types/tutorialTypes';

const TutorialContext = createContext<TutorialContextValue | null>(null);

const STORAGE_PREFIX_PROGRESS = 'attendance_tutorial_progress_';
const STORAGE_PREFIX_COMPLETED = 'attendance_tutorial_completed_';

const TRACK_ORDER: TutorialTrackId[] = [
  'overview',
  'semesters',
  'groups',
  'students_import',
  'classes_sessions',
  'attendance',
  'reports',
];

const DEFAULT_PROGRESS: TutorialProgress = {
  activeTrackId: 'overview',
  stepIndices: {},
  completedTracks: [],
  isAllCompleted: false,
};

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>('local_user');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState<TutorialTrackId>('overview');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState<TutorialProgress>(DEFAULT_PROGRESS);

  const navigate = useNavigate();
  const location = useLocation();

  const currentTrackSteps = TUTORIAL_STEPS_BY_TRACK[activeTrackId] ?? TUTORIAL_STEPS_BY_TRACK.overview;
  const currentStep: TutorialStep | null = isActive ? currentTrackSteps[currentStepIndex] ?? null : null;

  // Save progress helper
  const saveProgress = useCallback(
    (updated: Partial<TutorialProgress>) => {
      setProgress((prev) => {
        const next: TutorialProgress = {
          ...prev,
          ...updated,
          stepIndices: {
            ...prev.stepIndices,
            ...(updated.stepIndices ?? {}),
          },
        };
        try {
          localStorage.setItem(STORAGE_PREFIX_PROGRESS + userId, JSON.stringify(next));
        } catch {
          // ignore storage quota errors
        }
        return next;
      });
    },
    [userId],
  );

  // Initialize and force tutorial on first time sign up / login
  useEffect(() => {
    let disposed = false;
    async function initUserTutorial() {
      let uid = 'local_user';
      if (!localMode && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user?.id) {
            uid = data.session.user.id;
          }
        } catch {
          // fallback
        }
      }
      if (disposed) return;
      setUserId(uid);

      let savedProgress: TutorialProgress = DEFAULT_PROGRESS;
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX_PROGRESS + uid);
        if (raw) {
          savedProgress = { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
        }
      } catch {
        savedProgress = DEFAULT_PROGRESS;
      }

      const isCompletedFlag = localStorage.getItem(STORAGE_PREFIX_COMPLETED + uid) === 'true';
      if (isCompletedFlag) {
        savedProgress.isAllCompleted = true;
      }
      setProgress(savedProgress);

      // FORCED FOR FIRST TIME SIGN UP:
      // If user has not completed or explicitly skipped all tutorials,
      // force start the tutorial automatically from where they left off!
      if (!savedProgress.isAllCompleted) {
        const trackToResume = savedProgress.activeTrackId || 'overview';
        const stepToResume = savedProgress.stepIndices[trackToResume] ?? 0;

        const timer = window.setTimeout(() => {
          if (!disposed) {
            setActiveTrackId(trackToResume);
            setCurrentStepIndex(stepToResume);
            setIsActive(true);

            // Auto navigate to route if step has one
            const targetStep = (TUTORIAL_STEPS_BY_TRACK[trackToResume] ?? TUTORIAL_STEPS_BY_TRACK.overview)[stepToResume];
            if (targetStep?.route && location.pathname !== targetStep.route) {
              navigate(targetStep.route);
            }
          }
        }, 1200);

        return () => window.clearTimeout(timer);
      }
    }

    void initUserTutorial();
    return () => {
      disposed = true;
    };
  }, []);

  // Sync navigation when active step changes
  useEffect(() => {
    if (isActive && currentStep?.route) {
      if (location.pathname !== currentStep.route) {
        navigate(currentStep.route);
      }
    }
  }, [isActive, currentStep, location.pathname, navigate]);

  const dismissPrompt = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  const openGuideHub = useCallback(() => {
    setIsActive(false);
    setIsPromptOpen(true);
  }, []);

  const startTour = useCallback(
    (trackId: TutorialTrackId = 'overview', stepIdx: number = 0) => {
      setIsPromptOpen(false);
      setActiveTrackId(trackId);
      setCurrentStepIndex(stepIdx);
      setIsActive(true);

      saveProgress({
        activeTrackId: trackId,
        stepIndices: { [trackId]: stepIdx },
      });

      const initialStep = (TUTORIAL_STEPS_BY_TRACK[trackId] ?? TUTORIAL_STEPS_BY_TRACK.overview)[stepIdx];
      if (initialStep?.route && location.pathname !== initialStep.route) {
        navigate(initialStep.route);
      }
    },
    [saveProgress, location.pathname, navigate],
  );

  const resumeTour = useCallback(() => {
    // Find last active track or first uncompleted track
    const resumeTrack = progress.activeTrackId || 'overview';
    const resumeStep = progress.stepIndices[resumeTrack] ?? 0;
    startTour(resumeTrack, resumeStep);
  }, [progress, startTour]);

  // Skip the current track / topic and proceed to the next track or finish
  const skipCurrentTrack = useCallback(() => {
    const updatedCompleted = Array.from(new Set([...progress.completedTracks, activeTrackId]));
    const currentOrderIdx = TRACK_ORDER.indexOf(activeTrackId);
    const nextTrack = TRACK_ORDER.slice(currentOrderIdx + 1).find((t) => !updatedCompleted.includes(t));

    if (nextTrack) {
      const nextStepIdx = progress.stepIndices[nextTrack] ?? 0;
      setActiveTrackId(nextTrack);
      setCurrentStepIndex(nextStepIdx);
      saveProgress({
        activeTrackId: nextTrack,
        completedTracks: updatedCompleted,
      });
      const initialStep = (TUTORIAL_STEPS_BY_TRACK[nextTrack] ?? TUTORIAL_STEPS_BY_TRACK.overview)[nextStepIdx];
      if (initialStep?.route && location.pathname !== initialStep.route) {
        navigate(initialStep.route);
      }
    } else {
      setIsActive(false);
      saveProgress({
        completedTracks: updatedCompleted,
        isAllCompleted: true,
      });
      localStorage.setItem(STORAGE_PREFIX_COMPLETED + userId, 'true');
    }
  }, [activeTrackId, progress, saveProgress, userId, location.pathname, navigate]);

  // Skip the whole tutorial system completely
  const skipAllTutorials = useCallback(() => {
    setIsActive(false);
    setIsPromptOpen(false);
    saveProgress({ isAllCompleted: true });
    localStorage.setItem(STORAGE_PREFIX_COMPLETED + userId, 'true');
  }, [saveProgress, userId]);

  const nextStep = useCallback(() => {
    const steps = TUTORIAL_STEPS_BY_TRACK[activeTrackId] ?? TUTORIAL_STEPS_BY_TRACK.overview;
    if (currentStepIndex >= steps.length - 1) {
      // Completed this track!
      const updatedCompleted = Array.from(new Set([...progress.completedTracks, activeTrackId]));
      const currentOrderIdx = TRACK_ORDER.indexOf(activeTrackId);
      const nextTrack = TRACK_ORDER.slice(currentOrderIdx + 1).find((t) => !updatedCompleted.includes(t));

      if (nextTrack) {
        // Advance to next track
        const nextStepIdx = progress.stepIndices[nextTrack] ?? 0;
        setActiveTrackId(nextTrack);
        setCurrentStepIndex(nextStepIdx);
        saveProgress({
          activeTrackId: nextTrack,
          completedTracks: updatedCompleted,
        });
        const initialStep = (TUTORIAL_STEPS_BY_TRACK[nextTrack] ?? TUTORIAL_STEPS_BY_TRACK.overview)[nextStepIdx];
        if (initialStep?.route && location.pathname !== initialStep.route) {
          navigate(initialStep.route);
        }
      } else {
        // Completed all tracks!
        setIsActive(false);
        saveProgress({
          completedTracks: updatedCompleted,
          isAllCompleted: true,
        });
        localStorage.setItem(STORAGE_PREFIX_COMPLETED + userId, 'true');
      }
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      saveProgress({
        activeTrackId,
        stepIndices: { [activeTrackId]: nextIdx },
      });
    }
  }, [activeTrackId, currentStepIndex, progress, saveProgress, userId, location.pathname, navigate]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((current) => {
      const prevIdx = Math.max(0, current - 1);
      saveProgress({
        activeTrackId,
        stepIndices: { [activeTrackId]: prevIdx },
      });
      return prevIdx;
    });
  }, [activeTrackId, saveProgress]);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        isPromptOpen,
        activeTrackId,
        currentStepIndex,
        currentStep,
        totalSteps: currentTrackSteps.length,
        progress,
        availableTracks: TUTORIAL_TRACKS,
        startTour,
        resumeTour,
        nextStep,
        prevStep,
        skipCurrentTrack,
        skipAllTutorials,
        dismissPrompt,
        openGuideHub,
      }}
    >
      {children}

      {/* Guide Hub / Track Selector Modal */}
      <TutorialPromptModal
        isOpen={isPromptOpen}
        tracks={TUTORIAL_TRACKS}
        activeTrackId={activeTrackId}
        progress={progress}
        onResumeTour={resumeTour}
        onSelectTrack={(trackId, stepIdx) => startTour(trackId, stepIdx)}
        onSkipAll={skipAllTutorials}
        onDismiss={dismissPrompt}
      />

      {/* Interactive Spotlight & Guide Card */}
      <TutorialSpotlight
        isActive={isActive}
        step={currentStep}
        stepIndex={currentStepIndex}
        totalSteps={currentTrackSteps.length}
        activeTrackId={activeTrackId}
        onNext={nextStep}
        onPrev={prevStep}
        onSkipTrack={skipCurrentTrack}
        onSkipAll={skipAllTutorials}
        onOpenGuideHub={openGuideHub}
      />
    </TutorialContext.Provider>
  );
}

export function useTutorial(): TutorialContextValue {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
