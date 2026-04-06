/**
 * useDashboardMutations — tRPC mutation hooks for the AUREN dashboard.
 * Provides optimistic UI for habit toggles and reflection autosave.
 */

import { trpc } from "@/lib/trpc";

/** Toggle a habit's completion state with cache invalidation. */
export function useHabitToggle() {
  const utils = trpc.useUtils();

  return trpc.wellness.habitToggle.useMutation({
    // Optimistic update: flip the habit state immediately in the cache
    onMutate: async (input) => {
      await utils.wellness.today.cancel();
      const previous = utils.wellness.today.getData();

      utils.wellness.today.setData(undefined, (old) => {
        if (!old) return old;
        return {
          ...old,
          habits: old.habits.map((h) =>
            h.id === input.habitId ? { ...h, completed: input.completed } : h
          ),
        };
      });

      return { previous };
    },
    // Roll back on error
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) {
        utils.wellness.today.setData(undefined, ctx.previous);
      }
    },
    // Always re-sync from server after mutation settles
    onSettled: () => {
      utils.wellness.today.invalidate();
    },
  });
}

/** Analyze a reflection entry and return an AI insight. */
export function useReflectionAnalyze() {
  return trpc.ai.reflectionAnalyze.useMutation();
}
