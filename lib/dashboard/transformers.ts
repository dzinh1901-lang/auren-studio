/**
 * Dashboard data transformers.
 * Maps raw tRPC response shapes into UI-ready DTOs.
 * Keeps presentational components free of raw backend shapes.
 */

import type { GrowthCategory, WeeklyAnalytics, DayScore } from "./types";

// ─── Growth Journey ──────────────────────────────────────────────────────────

const GROWTH_COLORS = {
  Balanced: "#6BA896",
  Progressing: "#F5A623",
  "Needs Attention": "#E8445A",
} as const;

function scoreToLabel(score: number): "Balanced" | "Progressing" | "Needs Attention" {
  if (score > 75) return "Balanced";
  if (score > 50) return "Progressing";
  return "Needs Attention";
}

/**
 * Build a growth journey summary from the latest weekly scores.
 * Uses the most recent day's data for each pillar.
 */
export function transformWeeklyToGrowth(weekly: WeeklyAnalytics): GrowthCategory[] {
  const latest: DayScore = weekly.scores[weekly.scores.length - 1] ?? {
    mind: 50,
    body: 50,
    heart: 50,
    spirit: 50,
  };
  const prev: DayScore = weekly.scores[weekly.scores.length - 2] ?? latest;

  const pillars: Array<{ key: keyof DayScore; category: string }> = [
    { key: "mind", category: "Mindfulness" },
    { key: "body", category: "Physical Vitality" },
    { key: "heart", category: "Emotional Resilience" },
    { key: "spirit", category: "Spiritual Alignment" },
  ];

  return pillars.map(({ key, category }) => {
    const score = latest[key];
    const prevScore = prev[key];
    const label = scoreToLabel(score);
    const trend: "up" | "down" | "stable" =
      score > prevScore + 3 ? "up" : score < prevScore - 3 ? "down" : "stable";
    return {
      category,
      score,
      trend,
      label,
      color: GROWTH_COLORS[label],
    };
  });
}

// ─── Weekly Chart Data ────────────────────────────────────────────────────────

export type ChartSeries = {
  label: string;
  data: number[];
  color: string;
};

/**
 * Convert WeeklyAnalytics into a set of chart series ready for SVG rendering.
 */
export function transformWeeklyToChartSeries(weekly: WeeklyAnalytics): ChartSeries[] {
  return [
    { label: "Mind", data: weekly.scores.map((s) => s.mind), color: "#9B8FD4" },
    { label: "Body", data: weekly.scores.map((s) => s.body), color: "#6BA896" },
    { label: "Heart", data: weekly.scores.map((s) => s.heart), color: "#E07B7B" },
    { label: "Spirit", data: weekly.scores.map((s) => s.spirit), color: "#C9A96E" },
  ];
}

// ─── Sleep quality label ──────────────────────────────────────────────────────

export function sleepScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Poor";
}
