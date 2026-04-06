import React from 'react';
import type { GuidanceSession } from '@/lib/dashboard/types';

const theme = {
  card: '#FAF7F2',
  surface: '#EFE6DA',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
};

const TYPE_CONFIG = {
  mindfulness: { icon: '🧘', color: '#9B8FD4', label: 'Mindfulness' },
  movement: { icon: '🏃', color: '#6BA896', label: 'Movement' },
  reflection: { icon: '📝', color: '#C9A96E', label: 'Reflection' },
} as const;

type GuidanceCardProps = {
  guidance: GuidanceSession;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export default function GuidanceCard({ guidance, onRefresh, isRefreshing }: GuidanceCardProps) {
  const config = TYPE_CONFIG[guidance.type] ?? TYPE_CONFIG.mindfulness;

  return (
    <section
      aria-label="Today's Guidance"
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
          Today&apos;s Guidance
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh guidance"
            style={{
              background: 'none',
              border: `1px solid ${theme.border}`,
              borderRadius: 100,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 500,
              color: theme.textMuted,
              cursor: isRefreshing ? 'wait' : 'pointer',
              opacity: isRefreshing ? 0.5 : 1,
            }}
          >
            {isRefreshing ? 'Loading…' : '↺ Refresh'}
          </button>
        )}
      </div>

      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 12px',
            borderRadius: 100,
            background: `${config.color}18`,
            border: `1px solid ${config.color}33`,
            fontSize: 12,
            fontWeight: 600,
            color: config.color,
          }}
        >
          {config.icon} {config.label}
        </span>
        <span style={{ fontSize: 12, color: theme.textMuted }}>
          {guidance.duration} min
        </span>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: theme.textPrimary,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {guidance.title}
        </h3>
        <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.7, margin: 0 }}>
          {guidance.description}
        </p>
      </div>

      {/* CTA */}
      <button
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 20px',
          borderRadius: 100,
          background: theme.textPrimary,
          color: '#F7F2EB',
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.01em',
        }}
        aria-label={`Begin ${guidance.title}`}
      >
        Begin Session <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
