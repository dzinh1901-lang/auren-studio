import React from 'react';
import type { SleepData } from '@/lib/dashboard/types';

const theme = {
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
  calm: '#A8C5F5',
  recovery: '#7ECBA1',
};

const TREND_ICONS = { up: '↑', down: '↓', stable: '→' } as const;
const TREND_COLORS = { up: '#34C97B', down: '#E8445A', stable: '#F5A623' } as const;

type SleepCardProps = {
  sleep: SleepData;
};

export default function SleepCard({ sleep }: SleepCardProps) {
  const scorePercent = Math.min(100, Math.max(0, sleep.score));

  return (
    <section
      aria-label="Sleep Data"
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 2px 12px rgba(75,64,56,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Sleep</h2>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: TREND_COLORS[sleep.trend],
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
          aria-label={`Trend: ${sleep.trend}`}
        >
          <span aria-hidden="true">{TREND_ICONS[sleep.trend]}</span> {sleep.trend}
        </span>
      </div>

      {/* Hours + quality */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span
          style={{ fontSize: 36, fontWeight: 700, color: theme.textPrimary, lineHeight: 1 }}
          aria-label={`${sleep.hours} hours of sleep`}
        >
          {sleep.hours}
        </span>
        <span style={{ fontSize: 14, color: theme.textMuted }}>hrs</span>
        <span
          style={{
            marginLeft: 4,
            padding: '3px 10px',
            borderRadius: 100,
            background: `rgba(126,203,161,0.15)`,
            fontSize: 12,
            fontWeight: 600,
            color: theme.recovery,
          }}
        >
          {sleep.quality}
        </span>
      </div>

      {/* Score bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: theme.textMuted }}>Sleep Score</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: theme.textPrimary }}>{sleep.score}</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={sleep.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Sleep score: ${sleep.score} out of 100`}
          style={{
            height: 6,
            borderRadius: 3,
            background: 'rgba(111,98,87,0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${scorePercent}%`,
              background: `linear-gradient(90deg, ${theme.calm}, ${theme.recovery})`,
              borderRadius: 3,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </section>
  );
}
