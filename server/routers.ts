import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

const HEALTH_SYSTEM_PROMPT = `You are Vitara, a calm, supportive, and knowledgeable AI personal health companion. Your role is to help users understand their health data, provide wellness insights, and offer lifestyle guidance.

Guidelines:
- Maintain a warm, reassuring, and non-judgmental tone at all times
- Provide clear, simple explanations without medical jargon
- Focus on preventative wellness and lifestyle optimization, NOT medical diagnosis
- When discussing health data, translate numbers into meaningful insights
- Offer practical, actionable suggestions that are gentle and encouraging
- Respect user autonomy — suggest, never prescribe
- Keep responses concise (2-4 sentences for most replies) unless the user asks for detail
- Never use alarmist language; reframe concerns as opportunities for improvement
- If a user describes serious symptoms, gently recommend consulting a healthcare professional
- You have access to the user's current health metrics — use them to personalize your responses

Remember: You are a wellness companion, not a doctor. Your goal is to help users feel understood, informed, and motivated to take small positive steps.`;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  health: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
          healthContext: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const systemContent = input.healthContext
          ? `${HEALTH_SYSTEM_PROMPT}\n\nCurrent user health context:\n${input.healthContext}`
          : HEALTH_SYSTEM_PROMPT;

        const messages = [
          { role: "system" as const, content: systemContent },
          ...input.messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ];

        const response = await invokeLLM({ messages });
        const reply = response.choices[0]?.message?.content ?? "I'm here to help. Could you tell me more?";

        return { reply };
      }),

    dailyInsight: publicProcedure
      .input(
        z.object({
          healthContext: z.string(),
          userName: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const messages = [
          { role: "system" as const, content: HEALTH_SYSTEM_PROMPT },
          {
            role: "user" as const,
            content: `Based on this health data, provide a single short, encouraging daily insight (1-2 sentences max):\n${input.healthContext}`,
          },
        ];

        const response = await invokeLLM({ messages });
        const insight = response.choices[0]?.message?.content ?? "Stay hydrated and take a moment to breathe today.";

        return { insight };
      }),
  }),

  // ─── Wellness Router ──────────────────────────────────────────────────────
  wellness: router({
    /**
     * GET today's wellness snapshot.
     * Returns habits, sleep data, heart rate, and mood based on the authenticated user.
     * Data is deterministically seeded per user + date for consistent demo behaviour;
     * replace the seed logic with real DB queries once wellness tables exist.
     */
    today: protectedProcedure.query(({ ctx }) => {
      const seed = ctx.user.id * 137 + new Date().getDate() * 31;
      const rand = (min: number, max: number, s = 0) => {
        const x = Math.sin(seed + s) * 10000;
        return Math.round(min + (x - Math.floor(x)) * (max - min));
      };

      const habits = [
        { id: "meditation", name: "Meditation", completed: rand(0, 1, 1) === 1, streak: rand(1, 21, 11) },
        { id: "exercise", name: "Exercise", completed: rand(0, 1, 2) === 1, streak: rand(0, 14, 12) },
        { id: "reading", name: "Reading", completed: rand(0, 1, 3) === 1, streak: rand(0, 30, 13) },
        { id: "hydration", name: "Hydration", completed: rand(0, 1, 4) === 1, streak: rand(2, 10, 14) },
      ];

      const sleepHours = Math.round((rand(5, 9, 5) + rand(0, 9, 6) / 10) * 10) / 10;
      const sleep = {
        hours: sleepHours,
        score: rand(55, 95, 7),
        quality: sleepHours >= 7.5 ? "Excellent" : sleepHours >= 6 ? "Good" : "Poor",
        trend: (["up", "down", "stable"] as const)[rand(0, 2, 8)],
      };

      const heartRate = {
        bpm: rand(58, 82, 9),
        hrv: rand(28, 65, 10),
        spo2: rand(96, 99, 11),
      };

      const moodLabels = ["😔 Low", "😐 Okay", "🙂 Good", "😊 Great", "🌟 Excellent"] as const;
      const moodIndex = rand(0, 4, 15);
      const mood = {
        level: (moodIndex + 1) as 1 | 2 | 3 | 4 | 5,
        label: moodLabels[moodIndex],
      };

      return { habits, sleep, heartRate, mood };
    }),

    /**
     * POST toggle a habit's completion state.
     * Returns the updated habit state for optimistic UI reconciliation.
     */
    habitToggle: protectedProcedure
      .input(
        z.object({
          habitId: z.string().min(1),
          completed: z.boolean(),
        })
      )
      .mutation(({ input }) => {
        // In production, persist to DB here. For now, echo the toggle.
        return { habitId: input.habitId, completed: input.completed, updatedAt: new Date() };
      }),
  }),

  // ─── AI Router ────────────────────────────────────────────────────────────
  ai: router({
    /**
     * GET today's personalised AI guidance session.
     * Calls the LLM to generate a contextual recommendation.
     */
    guidanceToday: protectedProcedure
      .input(
        z.object({
          userName: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const name = input.userName ?? ctx.user.name ?? "there";
        const messages = [
          { role: "system" as const, content: HEALTH_SYSTEM_PROMPT },
          {
            role: "user" as const,
            content: `Generate a short, personalised wellness guidance session for ${name} today. Respond ONLY with valid JSON in this exact shape (no markdown, no extra keys): { "title": string, "description": string, "duration": number, "type": "mindfulness"|"movement"|"reflection" }`,
          },
        ];

        try {
          const response = await invokeLLM({ messages });
          const raw = response.choices[0]?.message?.content ?? "{}";
          const text = typeof raw === "string" ? raw : JSON.stringify(raw);
          // Strip markdown code fences if present
          const cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleaned) as {
            title?: string;
            description?: string;
            duration?: number;
            type?: string;
          };
          return {
            title: parsed.title ?? "Morning Mindfulness",
            description: parsed.description ?? "Take a few moments to breathe and set your intentions for the day.",
            duration: typeof parsed.duration === "number" ? parsed.duration : 10,
            type: (["mindfulness", "movement", "reflection"].includes(parsed.type ?? "")
              ? parsed.type
              : "mindfulness") as "mindfulness" | "movement" | "reflection",
          };
        } catch {
          return {
            title: "Gentle Check-In",
            description: "Pause for a moment. Notice how you feel right now — no judgment, just awareness.",
            duration: 5,
            type: "mindfulness" as const,
          };
        }
      }),

    /**
     * POST a journal entry for AI-powered reflection analysis.
     * Returns an insight based on the entry content.
     */
    reflectionAnalyze: protectedProcedure
      .input(
        z.object({
          content: z.string().min(1).max(4000),
        })
      )
      .mutation(async ({ input }) => {
        const messages = [
          { role: "system" as const, content: HEALTH_SYSTEM_PROMPT },
          {
            role: "user" as const,
            content: `Analyse this journal entry and provide a brief, compassionate insight (1-2 sentences). Respond with plain text only, no formatting:\n\n"${input.content}"`,
          },
        ];

        try {
          const response = await invokeLLM({ messages });
          const raw = response.choices[0]?.message?.content ?? "";
          const insight = typeof raw === "string" ? raw.trim() : "";
          return {
            insight: insight || "Thank you for reflecting. Every moment of self-awareness is a step forward.",
            analyzedAt: new Date(),
          };
        } catch {
          return {
            insight: "Thank you for reflecting. Every moment of self-awareness is a step forward.",
            analyzedAt: new Date(),
          };
        }
      }),

    /**
     * GET the latest AI coaching message for the authenticated user.
     */
    coachMessage: protectedProcedure
      .input(
        z.object({
          userName: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const name = input.userName ?? ctx.user.name ?? "there";
        const messages = [
          { role: "system" as const, content: HEALTH_SYSTEM_PROMPT },
          {
            role: "user" as const,
            content: `Write a single short coaching message for ${name} (1-2 sentences, warm and encouraging). Respond with plain text only.`,
          },
        ];

        try {
          const response = await invokeLLM({ messages });
          const raw = response.choices[0]?.message?.content ?? "";
          const message = typeof raw === "string" ? raw.trim() : "";
          return {
            message: message || "You're doing great — keep showing up for yourself one day at a time.",
            tone: "motivational" as const,
            timestamp: new Date(),
          };
        } catch {
          return {
            message: "You're doing great — keep showing up for yourself one day at a time.",
            tone: "motivational" as const,
            timestamp: new Date(),
          };
        }
      }),
  }),

  // ─── Analytics Router ─────────────────────────────────────────────────────
  analytics: router({
    /**
     * GET the last 7-day wellness overview.
     * Scores are seeded per user + day for deterministic demo data.
     * Replace with real DB aggregations once analytics tables exist.
     */
    weekly: protectedProcedure.query(({ ctx }) => {
      const days: string[] = [];
      const scores: Array<{ mind: number; body: number; heart: number; spirit: number }> = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toLocaleDateString("en-US", { weekday: "short" }));

        const seed = ctx.user.id * 137 + d.getDate() * 31 + i * 17;
        const r = (min: number, max: number, s = 0) => {
          const x = Math.sin(seed + s) * 10000;
          return Math.round(min + (x - Math.floor(x)) * (max - min));
        };
        scores.push({ mind: r(40, 95, 1), body: r(40, 95, 2), heart: r(40, 95, 3), spirit: r(40, 95, 4) });
      }

      return { days, scores };
    }),
  }),
});

export type AppRouter = typeof appRouter;
