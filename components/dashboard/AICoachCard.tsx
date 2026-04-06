import React from 'react';
import type { CoachMessage } from '@/lib/dashboard/types';

const theme = {
  card: '#FAF7F2',
  surface: '#EFE6DA',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
};

const TONE_CONFIG = {
  calm: { icon: '🌿', label: 'Calm', color: '#6BA896' },
  motivational: { icon: '⚡', label: 'Motivational', color: '#C9A96E' },
  reflective: { icon: '🔮', label: 'Reflective', color: '#9B8FD4' },
} as const;

type AICoachCardProps = {
  message: CoachMessage;
};

function formatTimestamp(date: Date): string {
  try {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function AICoachCard({ message }: AICoachCardProps) {
  const tone = TONE_CONFIG[message.tone] ?? TONE_CONFIG.motivational;

  return (
    <section
      aria-label="AI Coach"
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 2px 12px rgba(75,64,56,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
          AI Coach
        </h2>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 100,
            background: `${tone.color}15`,
            fontSize: 11,
            fontWeight: 600,
            color: tone.color,
          }}
        >
          {tone.icon} {tone.label}
        </span>
      </div>

      {/* Message */}
      <blockquote
        style={{
          margin: 0,
          padding: '16px 20px',
          background: theme.surface,
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
          borderLeft: `3px solid ${theme.gold}`,
          fontFamily: 'Newsreader, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 15,
          color: theme.textSecondary,
          lineHeight: 1.75,
        }}
      >
        &ldquo;{message.message}&rdquo;
      </blockquote>

      {/* Timestamp */}
      <p
        style={{ fontSize: 11, color: theme.textMuted, margin: 0 }}
        aria-label={`Sent at ${formatTimestamp(message.timestamp)}`}
      >
        {formatTimestamp(message.timestamp)}
      </p>
    </section>
  );
}
