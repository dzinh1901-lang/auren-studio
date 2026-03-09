import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
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
});

export type AppRouter = typeof appRouter;
