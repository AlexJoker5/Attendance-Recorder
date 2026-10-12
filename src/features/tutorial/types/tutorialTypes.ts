export type TutorialPlacement = 'bottom' | 'top' | 'right' | 'left' | 'center';

export type TutorialIconType =
  | 'sparkles'
  | 'calendar'
  | 'book'
  | 'users'
  | 'file'
  | 'user'
  | 'trophy'
  | 'clock'
  | 'check-circle'
  | 'alert-triangle'
  | 'file-spreadsheet'
  | 'layers';

export type TutorialTrackId =
  | 'overview'
  | 'semesters'
  | 'groups'
  | 'students_import'
  | 'classes_sessions'
  | 'attendance'
  | 'reports';

export interface TutorialTrackInfo {
  id: TutorialTrackId;
  title: string;
  description: string;
  icon: TutorialIconType;
  stepCount: number;
  route: string;
}

export interface TutorialStep {
  id: string;
  trackId: TutorialTrackId;
  questBadge: string;
  title: string;
  description: string;
  tip?: string;
  caution?: string;
  targetSelector: string | null;
  route?: string;
  placement: TutorialPlacement;
  icon: TutorialIconType;
}

export interface TutorialContextValue {
  isActive: boolean;
  isPromptOpen: boolean;
  activeTrackId: TutorialTrackId;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  totalSteps: number;
  availableTracks: TutorialTrackInfo[];
  startTour: (trackId?: TutorialTrackId) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  dismissPrompt: () => void;
  openGuideHub: () => void;
}
