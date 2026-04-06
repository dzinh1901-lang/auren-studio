import React from 'react';

const theme = {
  bg: '#F7F2EB',
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
};

type EmptyStateProps = {
  icon?: string;
  title?: string;
  message?: string;
};

export default function EmptyState({
  icon = '🌿',
  title = 'Nothing here yet',
  message = 'Check back later or complete some activities to see your data.',
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 36 }} aria-hidden="true">
        {icon}
      </div>
      <h4 style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
        {title}
      </h4>
      <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.65, maxWidth: 280, margin: 0 }}>
        {message}
      </p>
    </div>
  );
}
