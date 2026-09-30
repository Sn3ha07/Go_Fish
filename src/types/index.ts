import { CuteFishType } from '../components/PixelFish';

export type ImportanceLevel = 'low' | 'medium' | 'high';

export type TaskCategory = 
  | 'work' 
  | 'personal' 
  | 'study' 
  | 'health' 
  | 'creative' 
  | 'home';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedMinutes: number;
  importance: ImportanceLevel;
  category: TaskCategory;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  caughtCount: number;
  assignedFishSpeciesId?: string;
  notes?: string;
}

export interface FishSpecies {
  id: string;
  name: string;
  type: CuteFishType;
  color: string;
  tag: string;
  personality: string;
  nfcTagUid: string;
  vibe: string;
}

export interface FishPosition {
  x: number; // percentage 15 - 80
  y: number; // percentage 18 - 72
  facing: 'left' | 'right';
}

export type PrioritizationMode = 
  | 'combined' 
  | 'due_date' 
  | 'importance' 
  | 'duration' 
  | 'random';

export interface PrioritizationSettings {
  mode: PrioritizationMode;
  durationPreference: 'short' | 'balanced' | 'deep';
  dueWeight: number;
  importanceWeight: number;
  durationWeight: number;
}

export interface CaughtRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  taskCategory: TaskCategory;
  fishSpeciesId: string;
  fishName: string;
  caughtAt: string;
  pearlsEarned: number;
  selectionReason: string;
}

export interface UserStats {
  pearls: number;
  totalCompleted: number;
}

export interface UserPreferences {
  soundEnabled: boolean;
  reducedMotion: boolean;
  prioritization: PrioritizationSettings;
}
