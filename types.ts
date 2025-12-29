
export type EnergyLevel = 'low' | 'medium' | 'high';
export type TaskPreference = 'creative/art' | 'movement' | 'reflection' | 'focus' | 'skip';

export type GuideType = 'Cat' | 'Dog' | 'Penguin' | 'Dolphin' | 'Koala' | 'Capybara' | 'Swan' | 'Rabbit';

export interface Guide {
  type: GuideType;
  name: string;
  icon: string;
  personality: string;
  tone: string;
}

export interface StudentInput {
  guide: GuideType;
  mentalState: string;
  description: string;
  fieldOfStudy: string;
  energyLevel: EnergyLevel;
  taskPreference: TaskPreference | string;
}

export interface WellnessResponse {
  validation: string;
  growthInsight: string;
  smallTask: string;
  recoveryAction: string;
  encouragingNote: string;
  guideComment: string;
  lighterTask?: string; // Added for the fallback flow
}

export interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export interface Moment {
  id: string;
  task: string;
  timestamp: string;
  guideIcon: string;
  guideName: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  CHOOSE_GUIDE = 'CHOOSE_GUIDE',
  STEP_FEELING = 'STEP_FEELING',
  STEP_DESCRIPTION = 'STEP_DESCRIPTION',
  STEP_FIELD = 'STEP_FIELD',
  STEP_ENERGY = 'STEP_ENERGY',
  STEP_PREFERENCE = 'STEP_PREFERENCE',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  FEEDBACK_DONE = 'FEEDBACK_DONE',
  FEEDBACK_LIGHTER = 'FEEDBACK_LIGHTER',
  NOTES = 'NOTES',
  MOMENTS = 'MOMENTS'
}

export const GUIDES: Guide[] = [
  { type: 'Cat', name: 'Luna', icon: '🐱', personality: 'Observant and independent', tone: 'Playful but calming, likes to pause' },
  { type: 'Dog', name: 'Buddy', icon: '🐶', personality: 'Deeply loyal and encouraging', tone: 'Enthusiastic and warm-hearted' },
  { type: 'Penguin', name: 'Pippin', icon: '🐧', personality: 'Steady and down-to-earth', tone: 'Practical, sturdy, and very chill' },
  { type: 'Dolphin', name: 'Delphi', icon: '🐬', personality: 'Fluid and optimistic', tone: 'Flowy, social, and bright' },
  { type: 'Koala', name: 'Kobi', icon: '🐨', personality: 'The master of cozy rest', tone: 'Slow-paced, warm, and snuggly' },
  { type: 'Capybara', name: 'Cappy', icon: '🐹', personality: 'Unbothered and peaceful', tone: 'The ultimate calm, low-energy zen' },
  { type: 'Swan', name: 'Selene', icon: '🦢', personality: 'Elegant and reflective', tone: 'Poised, graceful, and thoughtful' },
  { type: 'Rabbit', name: 'Roo', icon: '🐰', personality: 'Quick but values quiet', tone: 'Gentle, soft-spoken, and caring' },
];
