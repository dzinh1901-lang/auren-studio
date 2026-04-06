/**
 * Dashboard typed DTOs — mirrors the tRPC response shapes from server/routers.ts.
 * These are the shapes flowing through the UI layer; keep them flat and UI-ready.
 */

// ─── Wellness ────────────────────────────────────────────────────────────────

export type Habit = {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
};

export type SleepData = {
  hours: number;
  score: number;
  quality: string;
  trend: "up" | "down" | "stable";
};

export type HeartRateData = {
  bpm: number;
  hrv: number;
  spo2: number;
};

export type MoodData = {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
};

export type WellnessToday = {
  habits: Habit[];
  sleep: SleepData;
  heartRate: HeartRateData;
  mood: MoodData;
};

// ─── AI ──────────────────────────────────────────────────────────────────────

export type GuidanceSession = {
  title: string;
  description: string;
  duration: number;
  type: "mindfulness" | "movement" | "reflection";
};

export type ReflectionAnalysis = {
  insight: string;
  analyzedAt: Date;
};

export type CoachMessage = {
  message: string;
  tone: "calm" | "motivational" | "reflective";
  timestamp: Date;
};

// ─── Analytics ───────────────────────────────────────────────────────────────

export type DayScore = {
  mind: number;
  body: number;
  heart: number;
  spirit: number;
};

export type WeeklyAnalytics = {
  days: string[];
  scores: DayScore[];
};

// ─── Growth Journey ───────────────────────────────────────────────────────────

export type GrowthCategory = {
  category: string;
  score: number;
  trend: "up" | "down" | "stable";
  label: "Balanced" | "Progressing" | "Needs Attention";
  color: string;
};

// ─── Reflections ─────────────────────────────────────────────────────────────

export type ReflectionEntry = {
  id: string;
  content: string;
  createdAt: Date;
  mood?: string;
  insight?: string;
};
