import type { TutorialStep } from '../types/tutorialTypes';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    questBadge: 'Quest 1 · Welcome',
    title: 'Welcome, Administrator!',
    description:
      'Welcome to Attendance Admin! This quick interactive guide will walk you through setting up semesters, organizing classes, managing students, and tracking attendance like a pro.',
    tip: 'You can pause, exit, or replay this tutorial anytime from the top bar or your Profile settings.',
    targetSelector: '[data-tour="brand"]',
    placement: 'bottom',
    icon: 'sparkles',
  },
  {
    id: 'semesters',
    questBadge: 'Quest 2 · Foundation',
    title: 'Start with a Semester',
    description:
      'Every record in your workspace lives inside a Semester. Create your active semester with start and end dates. When a semester ends, you can archive it to keep historical records safe.',
    tip: 'Switch between active and archived semesters anytime using the selector dropdown in the top bar.',
    targetSelector: '[data-tour="nav-semesters"]',
    placement: 'right',
    icon: 'calendar',
  },
  {
    id: 'groups',
    questBadge: 'Quest 3 · Curriculum',
    title: 'Organize Groups & Classes',
    description:
      'Structure your curriculum! Create student groups (e.g. "Batch 2026", "Section A") and assign specific classes (e.g. "Web Development", "Database Systems").',
    tip: 'Each class can have customized scheduled meeting times and passing attendance thresholds.',
    targetSelector: '[data-tour="nav-groups"]',
    placement: 'right',
    icon: 'book',
  },
  {
    id: 'students',
    questBadge: 'Quest 4 · Roster',
    title: 'Manage Your Students',
    description:
      'Register your students with their unique Student ID and names. Search them instantly by Name or Email address, and enroll them into their classes.',
    tip: 'Students often use multiple email accounts on Zoom. You can add extra email aliases for each student to achieve 100% automatic match accuracy!',
    targetSelector: '[data-tour="nav-students"]',
    placement: 'right',
    icon: 'users',
  },
  {
    id: 'imports',
    questBadge: 'Quest 5 · Automation',
    title: 'Zoom & Excel Imports',
    description:
      'Say goodbye to manual roll calls! Upload Zoom participant attendance logs or spreadsheets to automatically calculate durations, match students, and log presence.',
    tip: 'Visit Reports to review overall attendance trends and export comprehensive reports directly to Excel.',
    targetSelector: '[data-tour="nav-imports"]',
    placement: 'right',
    icon: 'file',
  },
  {
    id: 'profile',
    questBadge: 'Quest 6 · Account',
    title: 'Profile & Security',
    description:
      'Customize your display name, update your email address, change your password, or replay this tutorial whenever you need a quick refresher.',
    tip: 'You can also switch languages between English and Myanmar anytime in the top bar.',
    targetSelector: '[data-tour="topbar-profile"]',
    placement: 'bottom',
    icon: 'user',
  },
  {
    id: 'finish',
    questBadge: '🏆 Quest Complete',
    title: "You're All Set to Begin!",
    description:
      'Congratulations! You have completed the orientation. You are now ready to build your workspace and manage student attendance seamlessly.',
    tip: 'Click "Get Started" below to jump straight in and create your first semester.',
    targetSelector: null,
    placement: 'center',
    icon: 'trophy',
  },
];
