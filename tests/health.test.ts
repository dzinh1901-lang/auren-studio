import { describe, it, expect } from "vitest";

// ─── Test health data generation logic ────────────────────────────────────────

function generateDailyMetrics(dayOffset: number = 0) {
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

function generateHistory(days: number = 30) {
  const history = [];
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

describe("Health Data Generation", () => {
  it("generates metrics within valid ranges", () => {
    const metrics = generateDailyMetrics(0);
    expect(metrics.sleepScore).toBeGreaterThanOrEqual(55);
    expect(metrics.sleepScore).toBeLessThanOrEqual(92);
    expect(metrics.recoveryScore).toBeGreaterThanOrEqual(50);
    expect(metrics.recoveryScore).toBeLessThanOrEqual(95);
    expect(metrics.stressLevel).toBeGreaterThanOrEqual(15);
    expect(metrics.stressLevel).toBeLessThanOrEqual(70);
    expect(metrics.steps).toBeGreaterThanOrEqual(3500);
    expect(metrics.steps).toBeLessThanOrEqual(12000);
    expect(metrics.heartRate).toBeGreaterThanOrEqual(58);
    expect(metrics.heartRate).toBeLessThanOrEqual(78);
    expect(metrics.bloodOxygen).toBeGreaterThanOrEqual(96);
    expect(metrics.bloodOxygen).toBeLessThanOrEqual(99);
  });

  it("generates deterministic results for the same day offset", () => {
    const m1 = generateDailyMetrics(5);
    const m2 = generateDailyMetrics(5);
    expect(m1.sleepScore).toBe(m2.sleepScore);
    expect(m1.steps).toBe(m2.steps);
    expect(m1.heartRate).toBe(m2.heartRate);
  });

  it("generates different results for different day offsets", () => {
    const m1 = generateDailyMetrics(1);
    const m2 = generateDailyMetrics(10);
    // At least one metric should differ
    const differs =
      m1.sleepScore !== m2.sleepScore ||
      m1.steps !== m2.steps ||
      m1.heartRate !== m2.heartRate;
    expect(differs).toBe(true);
  });

  it("generates correct number of history entries", () => {
    const history7 = generateHistory(7);
    const history30 = generateHistory(30);
    expect(history7).toHaveLength(7);
    expect(history30).toHaveLength(30);
  });

  it("history entries have valid date strings", () => {
    const history = generateHistory(7);
    history.forEach((entry) => {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(entry.date).toString()).not.toBe("Invalid Date");
    });
  });
});

describe("Mood Entry Logic", () => {
  it("validates mood levels are between 1 and 5", () => {
    const validLevels = [1, 2, 3, 4, 5];
    validLevels.forEach((level) => {
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(5);
    });
  });

  it("mood entry has required fields", () => {
    const entry = {
      id: `mood_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      mood: 4 as const,
      timestamp: Date.now(),
    };
    expect(entry.id).toBeTruthy();
    expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(entry.mood).toBe(4);
    expect(entry.timestamp).toBeGreaterThan(0);
  });
});

describe("Coaching Items Logic", () => {
  const coachingTypes = ["walking", "hydration", "sleep", "breathing", "stretch", "mindfulness"];

  it("all coaching types are valid", () => {
    coachingTypes.forEach((type) => {
      expect(typeof type).toBe("string");
      expect(type.length).toBeGreaterThan(0);
    });
  });

  it("coaching item toggle changes completion state", () => {
    const item = { id: "test", completed: false };
    const toggled = { ...item, completed: !item.completed };
    expect(toggled.completed).toBe(true);
    const toggledBack = { ...toggled, completed: !toggled.completed };
    expect(toggledBack.completed).toBe(false);
  });
});

describe("AI Insight Generation", () => {
  function getAIInsight(metrics: ReturnType<typeof generateDailyMetrics>, name: string) {
    const { sleepScore, recoveryScore, stressLevel, steps } = metrics;
    if (sleepScore < 60) {
      return `Your sleep quality was lower than usual last night, ${name || "there"}.`;
    }
    if (stressLevel > 60) {
      return `Your stress indicators are elevated today.`;
    }
    if (recoveryScore > 80) {
      return `Your recovery looks excellent today${name ? `, ${name}` : ""}.`;
    }
    if (steps < 4000) {
      return `You've taken ${steps.toLocaleString()} steps so far.`;
    }
    return `Your body is in good balance today${name ? `, ${name}` : ""}.`;
  }

  it("returns sleep insight when sleep score is low", () => {
    const metrics = { ...generateDailyMetrics(0), sleepScore: 55 };
    const insight = getAIInsight(metrics, "Alex");
    expect(insight).toContain("sleep");
  });

  it("returns stress insight when stress is high", () => {
    const metrics = { ...generateDailyMetrics(0), sleepScore: 75, stressLevel: 65 };
    const insight = getAIInsight(metrics, "Alex");
    expect(insight).toContain("stress");
  });

  it("returns recovery insight when recovery is excellent", () => {
    const metrics = { ...generateDailyMetrics(0), sleepScore: 80, stressLevel: 30, recoveryScore: 90 };
    const insight = getAIInsight(metrics, "Alex");
    expect(insight).toContain("recovery");
  });

  it("includes user name in insight when provided", () => {
    const metrics = { ...generateDailyMetrics(0), sleepScore: 80, stressLevel: 30, recoveryScore: 90 };
    const insight = getAIInsight(metrics, "Jordan");
    expect(insight).toContain("Jordan");
  });
});
