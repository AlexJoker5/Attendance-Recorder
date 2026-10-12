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

export interface TutorialProgress {
  activeTrackId: TutorialTrackId;
  stepIndices: Partial<Record<TutorialTrackId, number>>;
  completedTracks: TutorialTrackId[];
  isAllCompleted: boolean;
}

export interface TutorialContextValue {
  isActive: boolean;
  isPromptOpen: boolean;
  activeTrackId: TutorialTrackId;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  totalSteps: number;
  progress: TutorialProgress;
  availableTracks: TutorialTrackInfo[];
  startTour: (trackId?: TutorialTrackId, stepIdx?: number) => void;
  resumeTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipCurrentTrack: () => void;
  skipAllTutorials: () => void;
  dismissPrompt: () => void;
  openGuideHub: () => void;
}
