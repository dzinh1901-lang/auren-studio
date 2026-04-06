# AUREN Dashboard — Implementation Guide

## Overview

This document describes the complete AUREN Dashboard feature added to the repository: a real-time, AI-driven wellness dashboard accessible at `/dashboard`.

---

## Files Added

### App & Routes
| File | Purpose |
|------|---------|
| `app/dashboard.tsx` | Main dashboard page — auth guard, header, layout assembly |

### Components (`components/dashboard/`)
| Component | Purpose |
|-----------|---------|
| `DashboardLayout.tsx` | Responsive 3-column grid (desktop → 2-column tablet → 1-column mobile) |
| `WelcomeHero.tsx` | Personalised greeting with date and motivational insight |
| `HabitsCard.tsx` | Daily habits list with optimistic-UI toggle and streak counter |
| `MoodCard.tsx` | Current mood display with colour-coded level indicator |
| `SleepCard.tsx` | Sleep hours, quality label, and score progress bar |
| `HeartRateCard.tsx` | BPM, HRV, SpO₂ with graceful empty state for missing device data |
| `GrowthJourney.tsx` | Four-pillar growth score bars with colour-coded labels |
| `GuidanceCard.tsx` | AI-generated daily guidance session with refresh button |
| `WeeklyOverview.tsx` | SVG sparkline chart for 7-day mind/body/heart/spirit scores |
| `AICoachCard.tsx` | Latest AI coaching message in a styled blockquote |
| `ReflectionCard.tsx` | Journaling textarea with 3-second debounced autosave and AI insight |
| `RecentReflections.tsx` | Last 7 journal entries with expand/collapse |
| `LoadingState.tsx` | Animated skeleton loader |
| `ErrorState.tsx` | Friendly error card with retry button |
| `EmptyState.tsx` | No-data placeholder with icon and message |

### Hooks
| File | Purpose |
|------|---------|
| `hooks/useDashboardData.ts` | tRPC query hooks (`useWellnessToday`, `useGuidanceToday`, `useCoachMessage`, `useWeeklyAnalytics`) |
| `hooks/useDashboardMutations.ts` | tRPC mutation hooks with optimistic UI (`useHabitToggle`, `useReflectionAnalyze`) |

### Library
| File | Purpose |
|------|---------|
| `lib/dashboard/types.ts` | TypeScript DTOs: `Habit`, `SleepData`, `HeartRateData`, `MoodData`, `GuidanceSession`, `CoachMessage`, `WeeklyAnalytics`, `GrowthCategory`, `ReflectionEntry` |
| `lib/dashboard/transformers.ts` | Pure data mappers: `transformWeeklyToGrowth`, `transformWeeklyToChartSeries`, `sleepScoreLabel` |

### Tests
| File | Purpose |
|------|---------|
| `tests/dashboard.test.ts` | tRPC procedure tests + transformer unit tests |

---

## Files Modified

| File | Change |
|------|--------|
| `app/_layout.tsx` | Added `<Stack.Screen name="dashboard" />` |
| `app/landing.tsx` | Updated primary CTA button (`href` → `/dashboard`) |
| `server/routers.ts` | Added `wellness`, `ai`, and `analytics` routers |

---

## New Route

| Route | File | Auth Required |
|-------|------|--------------|
| `/dashboard` | `app/dashboard.tsx` | Yes (redirects unauthenticated users) |

---

## New tRPC Procedures

### `wellness.today` — `protectedProcedure` query
Returns today's wellness snapshot for the authenticated user.

```ts
// Response shape
{
  habits: Array<{ id: string; name: string; completed: boolean; streak: number }>;
  sleep: { hours: number; score: number; quality: string; trend: "up" | "down" | "stable" };
  heartRate: { bpm: number; hrv: number; spo2: number };
  mood: { level: 1|2|3|4|5; label: string };
}
```

### `wellness.habitToggle` — `protectedProcedure` mutation
Toggles a habit's completion state.

```ts
// Input
{ habitId: string; completed: boolean }
// Response
{ habitId: string; completed: boolean; updatedAt: Date }
```

### `ai.guidanceToday` — `protectedProcedure` query
Calls the LLM to generate a personalised guidance session for today.

```ts
// Input (optional)
{ userName?: string }
// Response
{ title: string; description: string; duration: number; type: "mindfulness"|"movement"|"reflection" }
```

### `ai.reflectionAnalyze` — `protectedProcedure` mutation
Analyses a journal entry and returns an AI insight.

```ts
// Input
{ content: string }  // 1–4000 chars
// Response
{ insight: string; analyzedAt: Date }
```

### `ai.coachMessage` — `protectedProcedure` query
Returns a short AI coaching message.

```ts
// Input (optional)
{ userName?: string }
// Response
{ message: string; tone: "calm"|"motivational"|"reflective"; timestamp: Date }
```

### `analytics.weekly` — `protectedProcedure` query
Returns the last 7-day wellness score breakdown.

```ts
// Response
{
  days: string[];   // e.g. ["Mon", "Tue", …]
  scores: Array<{ mind: number; body: number; heart: number; spirit: number }>;
}
```

---

## Landing Page Integration

The primary CTA button in `app/landing.tsx` (Hero section) now links to `/dashboard`:

```tsx
<motion.a href="/dashboard" ...>
  Begin Your Journey <ArrowRight size={18} />
</motion.a>
```

This matches the existing navigation pattern (plain anchor tags styled with Framer Motion) and feels native to the landing page's aesthetic.

---

## Authentication Flow

1. `DashboardPage` calls `useAuth()` which checks for a valid session via `Api.getMe()` on web.
2. While loading, a full-screen spinner is shown.
3. If `user` is `null` after loading, an `UnauthenticatedView` is rendered with a "Return to Home" link.
4. All tRPC procedures use `protectedProcedure`, so the server independently validates the session.

---

## Data Flow

```
Landing page CTA → /dashboard
→ useAuth() checks session
  → if authenticated: tRPC queries run (wellness.today, ai.guidanceToday, ai.coachMessage, analytics.weekly)
  → React Query caches results (stale times: 5–30 min depending on procedure)
→ DashboardLayout renders three columns with all cards
→ Habit toggle: optimistic update → wellness.habitToggle mutation → cache invalidation
→ Reflection: local textarea state → 3s debounce → ai.reflectionAnalyze mutation → insight displayed
```

---

## Backend Contract Assumptions

- **Wellness data**: Currently seeded deterministically per `user.id + date`. Replace the seed logic in `server/routers.ts` with real DB queries once wellness tables are added to `drizzle/schema.ts`.
- **LLM calls**: `ai.guidanceToday`, `ai.coachMessage`, and `ai.reflectionAnalyze` call `invokeLLM` from `server/_core/llm.ts`. These require `OPENAI_API_KEY` / `BUILT_IN_FORGE_API_KEY` to be set in the environment.
- **Reflection persistence**: `RecentReflections` currently receives an empty array. Wire it to a real persistence layer (new DB table) once implemented.

---

## Environment / Config Assumptions

| Variable | Required for |
|----------|-------------|
| `OPENAI_API_KEY` / `BUILT_IN_FORGE_API_KEY` | AI procedures (guidance, reflection analysis, coach message) |
| Cookie-based session | Auth guard on dashboard page |

---

## Extending the Dashboard

### Adding a new card
1. Add the tRPC procedure to `server/routers.ts`.
2. Add the DTO shape to `lib/dashboard/types.ts`.
3. Add a query hook to `hooks/useDashboardData.ts`.
4. Create `components/dashboard/YourCard.tsx` following existing component patterns.
5. Import and place the card in `app/dashboard.tsx` inside `DashboardInner`.

### Persisting wellness data
Add new tables to `drizzle/schema.ts` and replace the seed-based logic in `server/routers.ts` with real DB reads/writes using `drizzle-orm`.

### Customising growth pillars
Edit `GROWTH_COLORS` and the `pillars` array inside `lib/dashboard/transformers.ts` (`transformWeeklyToGrowth`).

---

## Design System

The dashboard reuses the warm wellness aesthetic from `app/landing.tsx`:

| Token | Value |
|-------|-------|
| Background | `#F7F2EB` |
| Card surface | `#FAF7F2` |
| Text primary | `#4B4038` |
| Gold accent | `#C9A96E` |
| Borders | `rgba(111,98,87,0.14)` |

All components use inline CSS (matching the landing page pattern). Typography is injected via Google Fonts (`Newsreader` serif + `Outfit` sans).
