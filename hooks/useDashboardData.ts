/**
 * useDashboardData — tRPC query hooks for the AUREN dashboard.
 * All queries use React Query caching via the trpc client from lib/trpc.ts.
 */

import { trpc } from "@/lib/trpc";

/** Fetch today's wellness snapshot (habits, sleep, heart rate, mood). */
export function useWellnessToday() {
  return trpc.wellness.today.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/** Fetch today's AI guidance session. */
export function useGuidanceToday(userName?: string) {
  return trpc.ai.guidanceToday.useQuery(
    { userName },
    {
      staleTime: 30 * 60 * 1000, // 30 minutes — guidance stays fresh for half an hour
      retry: 1,
    }
  );
}

/** Fetch the latest AI coach message. */
export function useCoachMessage(userName?: string) {
  return trpc.ai.coachMessage.useQuery(
    { userName },
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      retry: 1,
    }
  );
}

/** Fetch the last 7-day wellness analytics. */
export function useWeeklyAnalytics() {
  return trpc.analytics.weekly.useQuery(undefined, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
