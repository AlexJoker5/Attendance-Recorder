import { localMode, supabase } from '@/lib/supabase';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { TutorialPromptModal } from '../components/TutorialPromptModal';
import { TutorialSpotlight } from '../components/TutorialSpotlight';
import { TUTORIAL_STEPS } from '../const/tutorialSteps';
import type { TutorialContextValue, TutorialStep } from '../types/tutorialTypes';

const TutorialContext = createContext<TutorialContextValue | null>(null);

const STORAGE_PREFIX_PROMPTED = 'attendance_tutorial_prompted_';
const STORAGE_PREFIX_COMPLETED = 'attendance_tutorial_completed_';

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>('local_user');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

  const dismissPrompt = useCallback(() => {
    setIsPromptOpen(false);
    localStorage.setItem(STORAGE_PREFIX_PROMPTED + userId, 'true');
  }, [userId]);

  const startTour = useCallback(() => {
    setIsPromptOpen(false);
    setCurrentStepIndex(0);
    setIsActive(true);
    localStorage.setItem(STORAGE_PREFIX_PROMPTED + userId, 'true');
  }, [userId]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(STORAGE_PREFIX_COMPLETED + userId, 'true');
  }, [userId]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((current) => {
      if (current >= TUTORIAL_STEPS.length - 1) {
        setIsActive(false);
        localStorage.setItem(STORAGE_PREFIX_COMPLETED + userId, 'true');
        return current;
      }
      return current + 1;
    });
  }, [userId]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((current) => Math.max(0, current - 1));
  }, []);

  const currentStep: TutorialStep | null = isActive ? TUTORIAL_STEPS[currentStepIndex] ?? null : null;

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        isPromptOpen,
        currentStepIndex,
        currentStep,
        totalSteps: TUTORIAL_STEPS.length,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        dismissPrompt,
      }}
    >
      {children}

      {/* Quest Invitation Dialog for New Users */}
      <TutorialPromptModal
        isOpen={isPromptOpen}
        onStart={startTour}
        onDismiss={dismissPrompt}
      />

      {/* Interactive Spotlight & Game Card */}
      <TutorialSpotlight
        isActive={isActive}
        step={currentStep}
        stepIndex={currentStepIndex}
        totalSteps={TUTORIAL_STEPS.length}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipTour}
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
