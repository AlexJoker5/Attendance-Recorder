export type TutorialStepId =
  | 'welcome'
  | 'semesters'
  | 'groups'
  | 'students'
  | 'imports'
  | 'profile'
  | 'finish';

export type TutorialPlacement = 'bottom' | 'top' | 'right' | 'left' | 'center';

export type TutorialIconType =
  | 'sparkles'
  | 'calendar'
  | 'book'
  | 'users'
  | 'file'
  | 'user'
  | 'trophy';

export interface TutorialStep {
  id: TutorialStepId;
  questBadge: string;
  title: string;
  description: string;
  tip: string;
  targetSelector: string | null;
  placement: TutorialPlacement;
  icon: TutorialIconType;
}

export interface TutorialContextValue {
  isActive: boolean;
  isPromptOpen: boolean;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  totalSteps: number;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  dismissPrompt: () => void;
}
