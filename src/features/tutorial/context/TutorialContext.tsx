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
  TutorialStep,
  TutorialTrackId,
} from '../types/tutorialTypes';

const TutorialContext = createContext<TutorialContextValue | null>(null);

const STORAGE_PREFIX_PROMPTED = 'attendance_tutorial_prompted_';
const STORAGE_PREFIX_COMPLETED = 'attendance_tutorial_completed_';

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>('local_user');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState<TutorialTrackId>('overview');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const currentTrackSteps = TUTORIAL_STEPS_BY_TRACK[activeTrackId] ?? TUTORIAL_STEPS_BY_TRACK.overview;
  const currentStep: TutorialStep | null = isActive ? currentTrackSteps[currentStepIndex] ?? null : null;

  // Identify user on mount to check onboarding status
  useEffect(() => {
    let disposed = false;
    async function checkUserOnboarding() {
      let uid = 'local_user';
      if (!localMode && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user?.id) {
            uid = data.session.user.id;
          }
        } catch {
          // fallback to local_user
        }
      }
      if (disposed) return;
      setUserId(uid);

      const prompted = localStorage.getItem(STORAGE_PREFIX_PROMPTED + uid);
      const completed = localStorage.getItem(STORAGE_PREFIX_COMPLETED + uid);

      // If never prompted and never completed, show prompt after a short initial render delay
      if (!prompted && !completed) {
        const timer = window.setTimeout(() => {
          if (!disposed) {
            setIsPromptOpen(true);
          }
        }, 1200);
        return () => window.clearTimeout(timer);
      }
    }

    void checkUserOnboarding();
    return () => {
      disposed = true;
    };
  }, []);

  // When step changes, check if step requires navigating to a specific route
  useEffect(() => {
    if (isActive && currentStep?.route) {
      if (location.pathname !== currentStep.route) {
        navigate(currentStep.route);
      }
    }
  }, [isActive, currentStep, location.pathname, navigate]);

  const dismissPrompt = useCallback(() => {
    setIsPromptOpen(false);
    localStorage.setItem(STORAGE_PREFIX_PROMPTED + userId, 'true');
  }, [userId]);

  const openGuideHub = useCallback(() => {
    setIsActive(false);
    setIsPromptOpen(true);
  }, []);

  const startTour = useCallback(
    (trackId: TutorialTrackId = 'overview') => {
      setIsPromptOpen(false);
      setActiveTrackId(trackId);
      setCurrentStepIndex(0);
      setIsActive(true);
      localStorage.setItem(STORAGE_PREFIX_PROMPTED + userId, 'true');

      // Navigate to initial track route if defined
      const initialStep = (TUTORIAL_STEPS_BY_TRACK[trackId] ?? TUTORIAL_STEPS_BY_TRACK.overview)[0];
      if (initialStep?.route && location.pathname !== initialStep.route) {
        navigate(initialStep.route);
      }
    },
    [userId, location.pathname, navigate],
  );

  const skipTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(STORAGE_PREFIX_COMPLETED + userId, 'true');
  }, [userId]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((current) => {
      const steps = TUTORIAL_STEPS_BY_TRACK[activeTrackId] ?? TUTORIAL_STEPS_BY_TRACK.overview;
      if (current >= steps.length - 1) {
        setIsActive(false);
        localStorage.setItem(STORAGE_PREFIX_COMPLETED + userId, 'true');
        return current;
      }
      return current + 1;
    });
  }, [activeTrackId, userId]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((current) => Math.max(0, current - 1));
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        isPromptOpen,
        activeTrackId,
        currentStepIndex,
        currentStep,
        totalSteps: currentTrackSteps.length,
        availableTracks: TUTORIAL_TRACKS,
        startTour,
        nextStep,
        prevStep,
        skipTour,
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
        onSelectTrack={(trackId) => startTour(trackId)}
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
        onSkip={skipTour}
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
