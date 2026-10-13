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

// Single unified localStorage key for all tutorial data across users
const SINGLE_STORAGE_KEY = 'attendance_tutorial';

export const TRACK_ORDER: TutorialTrackId[] = [
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
  skipped: false,
};

function readStoreFromStorage(): Record<string, TutorialProgress> {
  try {
    const raw = localStorage.getItem(SINGLE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoreToStorage(store: Record<string, TutorialProgress>) {
  try {
    localStorage.setItem(SINGLE_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota issues
  }
}

function cleanLegacyStorageKeys() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        key !== SINGLE_STORAGE_KEY &&
        (key.startsWith('attendance_tutorial_prompted_') ||
          key.startsWith('attendance_tutorial_completed_') ||
          key.startsWith('attendance_tutorial_progress_'))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

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

  // Single-object persistence helper
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

        const store = readStoreFromStorage();
        store[userId] = next;
        writeStoreToStorage(store);

        return next;
      });
    },
    [userId],
  );

  // Initialize and force tutorial on first time sign up / login
  useEffect(() => {
    let disposed = false;

    async function initUserTutorial() {
      // Clean up old fragmented localStorage keys once
      cleanLegacyStorageKeys();

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

      const store = readStoreFromStorage();
      let userProgress = store[uid];

      if (!userProgress) {
        userProgress = { ...DEFAULT_PROGRESS };
        store[uid] = userProgress;
        writeStoreToStorage(store);
      }

      setProgress(userProgress);

      // FORCED FOR FIRST TIME SIGN UP:
      // If user has not completed all tracks and has not clicked "Skip tutorial",
      // automatically start / resume the tutorial flow!
      if (!userProgress.isAllCompleted && !userProgress.skipped) {
        const trackToResume = userProgress.activeTrackId || 'overview';
        const stepToResume = userProgress.stepIndices[trackToResume] ?? 0;

        const timer = window.setTimeout(() => {
          if (!disposed) {
            setActiveTrackId(trackToResume);
            setCurrentStepIndex(stepToResume);
            setIsActive(true);

            // Auto-navigate to required route if defined
            const targetStep =
              (TUTORIAL_STEPS_BY_TRACK[trackToResume] ?? TUTORIAL_STEPS_BY_TRACK.overview)[stepToResume];
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

  // Sync route navigation when active step changes
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
        skipped: false, // user re-engaged
      });

      const initialStep = (TUTORIAL_STEPS_BY_TRACK[trackId] ?? TUTORIAL_STEPS_BY_TRACK.overview)[stepIdx];
      if (initialStep?.route && location.pathname !== initialStep.route) {
        navigate(initialStep.route);
      }
    },
    [saveProgress, location.pathname, navigate],
  );

  const resumeTour = useCallback(() => {
    // Find next uncompleted track or active track
    let resumeTrack = progress.activeTrackId || 'overview';
    if (progress.completedTracks.includes(resumeTrack)) {
      const firstUncompleted = TRACK_ORDER.find((t) => !progress.completedTracks.includes(t));
      if (firstUncompleted) resumeTrack = firstUncompleted;
    }
    const resumeStep = progress.stepIndices[resumeTrack] ?? 0;
    startTour(resumeTrack, resumeStep);
  }, [progress, startTour]);

  // Skip the current topic / track and automatically advance to the next topic
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
      // Completed all topics
      setIsActive(false);
      saveProgress({
        completedTracks: updatedCompleted,
        isAllCompleted: true,
      });
    }
  }, [activeTrackId, progress, saveProgress, location.pathname, navigate]);

  // Skip whole tutorial
  const skipAllTutorials = useCallback(() => {
    setIsActive(false);
    setIsPromptOpen(false);
    saveProgress({
      isAllCompleted: true,
      skipped: true,
    });
  }, [saveProgress]);

  // Next step — advances step by step, and automatically transitions into the next topic!
  const nextStep = useCallback(() => {
    const steps = TUTORIAL_STEPS_BY_TRACK[activeTrackId] ?? TUTORIAL_STEPS_BY_TRACK.overview;

    if (currentStepIndex >= steps.length - 1) {
      // Finished the current topic!
      const updatedCompleted = Array.from(new Set([...progress.completedTracks, activeTrackId]));
      const currentOrderIdx = TRACK_ORDER.indexOf(activeTrackId);
      const nextTrack = TRACK_ORDER.slice(currentOrderIdx + 1).find((t) => !updatedCompleted.includes(t));

      if (nextTrack) {
        // AUTOMATICALLY FORCE/CONTINUE INTO THE NEXT TOPIC!
        const nextStepIdx = 0;
        setActiveTrackId(nextTrack);
        setCurrentStepIndex(nextStepIdx);
        saveProgress({
          activeTrackId: nextTrack,
          completedTracks: updatedCompleted,
          stepIndices: { [nextTrack]: nextStepIdx },
        });

        const initialStep = (TUTORIAL_STEPS_BY_TRACK[nextTrack] ?? TUTORIAL_STEPS_BY_TRACK.overview)[nextStepIdx];
        if (initialStep?.route && location.pathname !== initialStep.route) {
          navigate(initialStep.route);
        }
      } else {
        // All 7 topics completed!
        setIsActive(false);
        saveProgress({
          completedTracks: updatedCompleted,
          isAllCompleted: true,
        });
      }
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      saveProgress({
        activeTrackId,
        stepIndices: { [activeTrackId]: nextIdx },
      });
    }
  }, [activeTrackId, currentStepIndex, progress, saveProgress, location.pathname, navigate]);

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

      {/* Guide Hub / Track Selector Modal with Clear Visual Progress */}
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
