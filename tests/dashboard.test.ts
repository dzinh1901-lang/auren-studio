import { describe, it, expect } from "vitest";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";
import { transformWeeklyToGrowth, transformWeeklyToChartSeries, sleepScoreLabel } from "../lib/dashboard/transformers";
import type { WeeklyAnalytics } from "../lib/dashboard/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 42): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user-openid",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createUnauthContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return { ctx };
}

// ─── wellness.today ───────────────────────────────────────────────────────────

describe("wellness.today", () => {
  it("returns a valid wellness snapshot for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.wellness.today();

    expect(result).toHaveProperty("habits");
    expect(result).toHaveProperty("sleep");
    expect(result).toHaveProperty("heartRate");
    expect(result).toHaveProperty("mood");
  });

  it("habits array has expected shape", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.wellness.today();

    expect(Array.isArray(result.habits)).toBe(true);
    expect(result.habits.length).toBeGreaterThan(0);

    for (const habit of result.habits) {
      expect(typeof habit.id).toBe("string");
      expect(typeof habit.name).toBe("string");
      expect(typeof habit.completed).toBe("boolean");
      expect(typeof habit.streak).toBe("number");
    }
  });

  it("sleep data has valid ranges", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.wellness.today();

    expect(result.sleep.score).toBeGreaterThanOrEqual(0);
    expect(result.sleep.score).toBeLessThanOrEqual(100);
    expect(result.sleep.hours).toBeGreaterThan(0);
    expect(result.sleep.hours).toBeLessThanOrEqual(12);
    expect(["up", "down", "stable"]).toContain(result.sleep.trend);
  });

  it("heart rate data has valid ranges", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.wellness.today();

    expect(result.heartRate.bpm).toBeGreaterThanOrEqual(40);
    expect(result.heartRate.bpm).toBeLessThanOrEqual(120);
    expect(result.heartRate.spo2).toBeGreaterThanOrEqual(90);
    expect(result.heartRate.spo2).toBeLessThanOrEqual(100);
  });

  it("mood level is between 1 and 5", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.wellness.today();

    expect(result.mood.level).toBeGreaterThanOrEqual(1);
    expect(result.mood.level).toBeLessThanOrEqual(5);
    expect(typeof result.mood.label).toBe("string");
  });

  it("throws UNAUTHORIZED for unauthenticated callers", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.wellness.today()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("returns deterministic results for the same user and date", async () => {
    const { ctx } = createAuthContext(42);
    const caller = appRouter.createCaller(ctx);
    const r1 = await caller.wellness.today();
    const r2 = await caller.wellness.today();

    expect(r1.sleep.score).toBe(r2.sleep.score);
    expect(r1.heartRate.bpm).toBe(r2.heartRate.bpm);
  });
});

// ─── wellness.habitToggle ─────────────────────────────────────────────────────

describe("wellness.habitToggle", () => {
  it("echoes back the habit toggle state", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.wellness.habitToggle({ habitId: "meditation", completed: true });

    expect(result.habitId).toBe("meditation");
    expect(result.completed).toBe(true);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it("supports toggling to false", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.wellness.habitToggle({ habitId: "exercise", completed: false });

    expect(result.completed).toBe(false);
  });

  it("throws UNAUTHORIZED for unauthenticated callers", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.wellness.habitToggle({ habitId: "reading", completed: true })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects empty habitId", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.wellness.habitToggle({ habitId: "", completed: true })
    ).rejects.toThrow();
  });
});

// ─── analytics.weekly ────────────────────────────────────────────────────────

describe("analytics.weekly", () => {
  it("returns 7 days and 7 score entries", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.analytics.weekly();

    expect(result.days).toHaveLength(7);
    expect(result.scores).toHaveLength(7);
  });

  it("all scores are within valid range", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.analytics.weekly();

    for (const score of result.scores) {
      expect(score.mind).toBeGreaterThanOrEqual(0);
      expect(score.mind).toBeLessThanOrEqual(100);
      expect(score.body).toBeGreaterThanOrEqual(0);
      expect(score.body).toBeLessThanOrEqual(100);
      expect(score.heart).toBeGreaterThanOrEqual(0);
      expect(score.heart).toBeLessThanOrEqual(100);
      expect(score.spirit).toBeGreaterThanOrEqual(0);
      expect(score.spirit).toBeLessThanOrEqual(100);
    }
  });

  it("day labels are non-empty strings", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.analytics.weekly();

    for (const day of result.days) {
      expect(typeof day).toBe("string");
      expect(day.length).toBeGreaterThan(0);
    }
  });

  it("throws UNAUTHORIZED for unauthenticated callers", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.analytics.weekly()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

// ─── Transformer: transformWeeklyToGrowth ────────────────────────────────────

describe("transformWeeklyToGrowth", () => {
  const makeWeekly = (overrideScore?: Partial<{ mind: number; body: number; heart: number; spirit: number }>): WeeklyAnalytics => ({
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    scores: Array.from({ length: 7 }, (_, i) => ({
      mind: overrideScore?.mind ?? 60 + i,
      body: overrideScore?.body ?? 55 + i,
      heart: overrideScore?.heart ?? 70 + i,
      spirit: overrideScore?.spirit ?? 50 + i,
    })),
  });

  it("returns 4 growth categories", () => {
    const categories = transformWeeklyToGrowth(makeWeekly());
    expect(categories).toHaveLength(4);
  });

  it("labels scores above 75 as Balanced", () => {
    const weekly = makeWeekly({ mind: 80, body: 80, heart: 80, spirit: 80 });
    const categories = transformWeeklyToGrowth(weekly);
    for (const cat of categories) {
      expect(cat.label).toBe("Balanced");
    }
  });

  it("labels scores 51-75 as Progressing", () => {
    const weekly = makeWeekly({ mind: 60, body: 60, heart: 60, spirit: 60 });
    const categories = transformWeeklyToGrowth(weekly);
    for (const cat of categories) {
      expect(cat.label).toBe("Progressing");
    }
  });

  it("labels scores ≤50 as Needs Attention", () => {
    const weekly = makeWeekly({ mind: 40, body: 40, heart: 40, spirit: 40 });
    const categories = transformWeeklyToGrowth(weekly);
    for (const cat of categories) {
      expect(cat.label).toBe("Needs Attention");
    }
  });

  it("each category has a non-empty color string", () => {
    const categories = transformWeeklyToGrowth(makeWeekly());
    for (const cat of categories) {
      expect(typeof cat.color).toBe("string");
      expect(cat.color.length).toBeGreaterThan(0);
    }
  });

  it("handles empty scores array gracefully", () => {
    const weekly: WeeklyAnalytics = { days: [], scores: [] };
    const categories = transformWeeklyToGrowth(weekly);
    // Should return 4 categories with fallback scores
    expect(categories).toHaveLength(4);
  });
});

// ─── Transformer: transformWeeklyToChartSeries ────────────────────────────────

describe("transformWeeklyToChartSeries", () => {
  it("returns 4 series", () => {
    const weekly: WeeklyAnalytics = {
      days: ["Mon"],
      scores: [{ mind: 70, body: 60, heart: 80, spirit: 65 }],
    };
    const series = transformWeeklyToChartSeries(weekly);
    expect(series).toHaveLength(4);
  });

  it("each series has correct data length", () => {
    const weekly: WeeklyAnalytics = {
      days: ["Mon", "Tue", "Wed"],
      scores: [
        { mind: 70, body: 60, heart: 80, spirit: 65 },
        { mind: 75, body: 65, heart: 85, spirit: 70 },
        { mind: 80, body: 70, heart: 90, spirit: 75 },
      ],
    };
    const series = transformWeeklyToChartSeries(weekly);
    for (const s of series) {
      expect(s.data).toHaveLength(3);
    }
  });
});

// ─── Transformer: sleepScoreLabel ─────────────────────────────────────────────

describe("sleepScoreLabel", () => {
  it("returns Excellent for score >= 85", () => {
    expect(sleepScoreLabel(85)).toBe("Excellent");
    expect(sleepScoreLabel(100)).toBe("Excellent");
  });

  it("returns Good for score 70-84", () => {
    expect(sleepScoreLabel(70)).toBe("Good");
    expect(sleepScoreLabel(84)).toBe("Good");
  });

  it("returns Fair for score 55-69", () => {
    expect(sleepScoreLabel(55)).toBe("Fair");
    expect(sleepScoreLabel(69)).toBe("Fair");
  });

  it("returns Poor for score < 55", () => {
    expect(sleepScoreLabel(54)).toBe("Poor");
    expect(sleepScoreLabel(0)).toBe("Poor");
  });
});
