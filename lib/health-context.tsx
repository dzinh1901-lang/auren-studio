import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string; // ISO date string
  mood: MoodLevel;
  note?: string;
  timestamp: number;
}

export interface HealthMetrics {
  sleepScore: number;       // 0-100
  recoveryScore: number;    // 0-100
  stressLevel: number;      // 0-100 (higher = more stress)
  steps: number;
  heartRate: number;
  hrv: number;              // heart rate variability
  sleepHours: number;
  bloodOxygen: number;      // SpO2 %
}

export interface DailySnapshot {
  date: string;
  metrics: HealthMetrics;
}

export interface CoachingItem {
  id: string;
  type: "walking" | "hydration" | "sleep" | "breathing" | "stretch" | "mindfulness";
  title: string;
  description: string;
  completed: boolean;
  date: string;
}

export interface UserProfile {
  name: string;
  age: number;
  goal: "balance" | "sleep" | "stress" | "fitness" | "mindfulness";
  onboardingComplete: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface HealthContextValue {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  todayMetrics: HealthMetrics;
  history: DailySnapshot[];
  moodLog: MoodEntry[];
  addMoodEntry: (mood: MoodLevel, note?: string) => Promise<void>;
  todayMood: MoodEntry | null;
  coachingItems: CoachingItem[];
  toggleCoachingItem: (id: string) => Promise<void>;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  isLoading: boolean;
}

// ─── Default data generators ──────────────────────────────────────────────────

function generateDailyMetrics(dayOffset: number = 0): HealthMetrics {
  const seed = dayOffset * 137;
  const rand = (min: number, max: number, s: number = 0) => {
    const x = Math.sin(seed + s) * 10000;
    const frac = x - Math.floor(x);
    return Math.round(min + frac * (max - min));
  };
  return {
    sleepScore: rand(55, 92, 1),
    recoveryScore: rand(50, 95, 2),
    stressLevel: rand(15, 70, 3),
    steps: rand(3500, 12000, 4),
    heartRate: rand(58, 78, 5),
    hrv: rand(28, 65, 6),
    sleepHours: Math.round((rand(5, 9, 7) + rand(0, 10, 8) / 10) * 10) / 10,
    bloodOxygen: rand(96, 99, 9),
  };
}

function generateHistory(days: number = 30): DailySnapshot[] {
  const history: DailySnapshot[] = [];
  for (let i = days; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    history.push({
      date: d.toISOString().split("T")[0],
      metrics: generateDailyMetrics(i),
    });
  }
  return history;
}

function generateCoachingItems(date: string): CoachingItem[] {
  return [
    {
      id: `${date}-walk`,
      type: "walking",
      title: "10-Minute Walk",
      description: "A short walk can boost your mood and energy levels.",
      completed: false,
      date,
    },
    {
      id: `${date}-hydration`,
      type: "hydration",
      title: "Hydration Check",
      description: "Drink a glass of water now. Staying hydrated supports focus and recovery.",
      completed: false,
      date,
    },
    {
      id: `${date}-sleep`,
      type: "sleep",
      title: "Wind-Down Routine",
      description: "Dim your screens 30 minutes before bed to improve sleep quality.",
      completed: false,
      date,
    },
    {
      id: `${date}-breathing`,
      type: "breathing",
      title: "Breathing Exercise",
      description: "A 4-minute breathing session can reduce stress and improve HRV.",
      completed: false,
      date,
    },
    {
      id: `${date}-stretch`,
      type: "stretch",
      title: "Gentle Stretch",
      description: "Spend 5 minutes stretching to release tension and improve circulation.",
      completed: false,
      date,
    },
  ];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const defaultProfile: UserProfile = {
  name: "",
  age: 0,
  goal: "balance",
  onboardingComplete: false,
};

const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const [coachingItems, setCoachingItems] = useState<CoachingItem[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayMetrics = generateDailyMetrics(0);
  const history = generateHistory(30);

  // Load persisted data
  useEffect(() => {
    async function load() {
      try {
        const [profileRaw, moodRaw, coachingRaw, chatRaw] = await Promise.all([
          AsyncStorage.getItem("hc_profile"),
          AsyncStorage.getItem("hc_mood_log"),
          AsyncStorage.getItem(`hc_coaching_${todayStr}`),
          AsyncStorage.getItem("hc_chat_history"),
        ]);
        if (profileRaw) setProfile(JSON.parse(profileRaw));
        if (moodRaw) setMoodLog(JSON.parse(moodRaw));
        if (coachingRaw) {
          setCoachingItems(JSON.parse(coachingRaw));
        } else {
          const items = generateCoachingItems(todayStr);
          setCoachingItems(items);
          await AsyncStorage.setItem(`hc_coaching_${todayStr}`, JSON.stringify(items));
        }
        if (chatRaw) setChatHistory(JSON.parse(chatRaw));
      } catch (e) {
        console.warn("Failed to load health data:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem("hc_profile", JSON.stringify(next));
      return next;
    });
  }, []);

  const addMoodEntry = useCallback(async (mood: MoodLevel, note?: string) => {
    const entry: MoodEntry = {
      id: `mood_${Date.now()}`,
      date: todayStr,
      mood,
      note,
      timestamp: Date.now(),
    };
    setMoodLog((prev) => {
      const next = [entry, ...prev.filter((e) => e.date !== todayStr)];
      AsyncStorage.setItem("hc_mood_log", JSON.stringify(next));
      return next;
    });
  }, [todayStr]);

  const todayMood = moodLog.find((e) => e.date === todayStr) ?? null;

  const toggleCoachingItem = useCallback(async (id: string) => {
    setCoachingItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      AsyncStorage.setItem(`hc_coaching_${todayStr}`, JSON.stringify(next));
      return next;
    });
  }, [todayStr]);

  const addChatMessage = useCallback(async (msg: ChatMessage) => {
    setChatHistory((prev) => {
      const next = [...prev, msg];
      // Keep last 100 messages
      const trimmed = next.slice(-100);
      AsyncStorage.setItem("hc_chat_history", JSON.stringify(trimmed));
      return trimmed;
    });
  }, []);

  const clearChatHistory = useCallback(async () => {
    setChatHistory([]);
    await AsyncStorage.removeItem("hc_chat_history");
  }, []);

  return (
    <HealthContext.Provider
      value={{
        profile,
        updateProfile,
        todayMetrics,
        history,
        moodLog,
        addMoodEntry,
        todayMood,
        coachingItems,
        toggleCoachingItem,
        chatHistory,
        addChatMessage,
        clearChatHistory,
        isLoading,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error("useHealth must be used within HealthProvider");
  return ctx;
}
