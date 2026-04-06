import React, { useMemo } from 'react';

const theme = {
  bg: '#F7F2EB',
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
};

type WelcomeHeroProps = {
  userName?: string | null;
  insight?: string;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function WelcomeHero({ userName, insight }: WelcomeHeroProps) {
  const greeting = useMemo(getGreeting, []);
  const dateStr = useMemo(formatDate, []);
  const displayName = userName ? `, ${userName}` : '';

  return (
    <section
      aria-label="Welcome"
      style={{
        background: `linear-gradient(135deg, ${theme.card} 0%, rgba(201,169,110,0.08) 100%)`,
        borderRadius: 24,
        padding: '32px 36px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 4px 24px rgba(75,64,56,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Date */}
      <p style={{ fontSize: 13, color: theme.textMuted, fontWeight: 500, letterSpacing: '0.04em', margin: 0 }}>
        {dateStr}
      </p>

      {/* Greeting */}
      <h1
        className="font-serif"
        style={{
          fontSize: 'clamp(26px, 4vw, 38px)',
          fontWeight: 300,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: theme.textPrimary,
          margin: 0,
        }}
      >
        {greeting}
        <em style={{ fontStyle: 'italic', color: theme.gold }}>{displayName}</em>
      </h1>

      {/* Insight */}
      {insight && (
        <p
          style={{
            fontSize: 15,
            color: theme.textSecondary,
            lineHeight: 1.7,
            maxWidth: 560,
            margin: 0,
          }}
        >
          {insight}
        </p>
      )}
    </section>
  );
}
