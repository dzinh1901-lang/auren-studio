import React from 'react';

const theme = {
  bg: '#F7F2EB',
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
  error: '#E8445A',
  errorBg: 'rgba(232,68,90,0.08)',
};

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: 16,
        background: theme.errorBg,
        borderRadius: 20,
        border: `1px solid ${theme.error}33`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: `${theme.error}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
        }}
        aria-hidden="true"
      >
        ⚠️
      </div>
      <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.6, maxWidth: 320 }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '10px 24px',
            borderRadius: 100,
            background: theme.textPrimary,
            color: theme.bg,
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
