import React from 'react';
import type { MoodData } from '@/lib/dashboard/types';

const theme = {
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
};

const MOOD_COLORS: Record<number, string> = {
  1: '#E8445A',
  2: '#F5A623',
  3: '#C9A96E',
  4: '#6BA896',
  5: '#34C97B',
};

type MoodCardProps = {
  mood: MoodData;
};

export default function MoodCard({ mood }: MoodCardProps) {
  const color = MOOD_COLORS[mood.level] ?? theme.gold;

  return (
    <section
      aria-label="Current Mood"
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 2px 12px rgba(75,64,56,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Today&apos;s Mood</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Mood dot */}
        <div
          aria-hidden="true"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `${color}18`,
            border: `2px solid ${color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            flexShrink: 0,
          }}
        >
          {mood.label.split(' ')[0]}
        </div>

        <div>
          <p
            style={{ fontSize: 20, fontWeight: 700, color, margin: 0, lineHeight: 1.2 }}
            aria-label={`Mood: ${mood.label}`}
          >
            {mood.label.split(' ').slice(1).join(' ')}
          </p>
          <p style={{ fontSize: 13, color: theme.textMuted, margin: 0, marginTop: 2 }}>
            How you feel today
          </p>
        </div>
      </div>

      {/* Level dots */}
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: level <= mood.level ? color : `rgba(111,98,87,0.1)`,
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  );
}
