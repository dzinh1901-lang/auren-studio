import React from 'react';
import type { GrowthCategory } from '@/lib/dashboard/types';

const theme = {
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
};

const TREND_ICONS = { up: '↑', down: '↓', stable: '→' } as const;

type GrowthJourneyProps = {
  categories: GrowthCategory[];
};

function CategoryRow({ cat }: { cat: GrowthCategory }) {
  const trendColor = cat.trend === 'up' ? '#34C97B' : cat.trend === 'down' ? '#E8445A' : '#F5A623';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: theme.textPrimary }}>
            {cat.category}
          </span>
          <span
            aria-label={`Trend: ${cat.trend}`}
            style={{ fontSize: 12, color: trendColor, fontWeight: 700 }}
          >
            {TREND_ICONS[cat.trend]}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              padding: '2px 9px',
              borderRadius: 100,
              background: `${cat.color}18`,
              fontSize: 11,
              fontWeight: 600,
              color: cat.color,
            }}
          >
            {cat.label}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary, minWidth: 28, textAlign: 'right' }}>
            {cat.score}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div
        role="progressbar"
        aria-valuenow={cat.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${cat.category}: ${cat.score} out of 100`}
        style={{ height: 5, borderRadius: 3, background: 'rgba(111,98,87,0.1)', overflow: 'hidden' }}
      >
        <div
          style={{
            height: '100%',
            width: `${cat.score}%`,
            background: cat.color,
            borderRadius: 3,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function GrowthJourney({ categories }: GrowthJourneyProps) {
  return (
    <section
      aria-label="Growth Journey"
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
      <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
        Growth Journey
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {categories.map((cat) => (
          <CategoryRow key={cat.category} cat={cat} />
        ))}
      </div>
    </section>
  );
}
