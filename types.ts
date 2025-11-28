export enum HabitIntensity {
  LOW = 'LOW',
  MED = 'MED',
  HIGH = 'HIGH'
}

export enum ExerciseType {
  RUNNING = 'RUNNING',
  PUSHUPS = 'PUSHUPS',
  PULLUPS = 'PULLUPS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  token: string;
  emailVerified: boolean;
}

export interface BattleLog {
  date: string;
  // Legacy fields (Dashboard)
  topGoal: string;
  essentialTask: string;
  dailyRule: string;
  completed: boolean;
  streak: number;
  aiSummary?: string;
  // New fields (DataService)
  mood?: number;
  sleep?: number;
  notes?: string;
  completedHabits?: string[];
}

export interface Habit {
  id: string;
  title: string;
  intensity: HabitIntensity;
  streak: number;
  completedToday: boolean;
}

export interface PillarData {
  name: string;
  score: number; // 0-100
  notes: string;
}
// Alias for backward compatibility if needed, or just use PillarData everywhere
export type Pillar = PillarData;

export interface IdentityData {
  values: string[];
  goals: string[];
  antiGoals: string[];
  statement: string;
  map?: IdentityItem[];
}
// Legacy IdentityItem for backward compatibility if needed
export interface IdentityItem {
  id: string;
  weakness: string;
  strength: string;
}

export interface RunLog {
  id: string;
  date: string;
  distanceKm: number;
  timeMinutes: number;
  pace: number; // min/km
}

export interface PushupLog {
  id?: string;
  date: string;
  count: number;
}

export interface PullupLog {
  id?: string;
  date: string;
  reps: number;
  sets: number;
  maxSet: number;
}

export type Screen = 'DASHBOARD' | 'HABITS' | 'PILLARS' | 'IDENTITY' | 'PERFORMANCE' | 'FOCUS' | 'AUTH';
