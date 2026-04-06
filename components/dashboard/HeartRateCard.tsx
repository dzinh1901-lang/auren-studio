import React from 'react';
import type { HeartRateData } from '@/lib/dashboard/types';
import EmptyState from './EmptyState';

const theme = {
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
};

type HeartRateCardProps = {
  heartRate?: HeartRateData;
};

function Metric({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        flex: 1,
      }}
    >
      <span
        style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary }}
        aria-label={`${label}: ${value} ${unit}`}
      >
        {value}
        <span style={{ fontSize: 11, fontWeight: 400, color: theme.textMuted, marginLeft: 2 }}>
          {unit}
        </span>
      </span>
      <span style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500, letterSpacing: '0.04em' }}>
        {label}
      </span>
    </div>
  );
}

export default function HeartRateCard({ heartRate }: HeartRateCardProps) {
  return (
    <section
      aria-label="Heart Rate & Biometrics"
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
      <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Biometrics</h2>

      {!heartRate ? (
        <EmptyState
          icon="💓"
          title="No device data"
          message="Connect a wearable to see your heart rate and biometric data."
        />
      ) : (
        <>
          {/* BPM — primary metric */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: '#E07B7B', lineHeight: 1 }}>
              {heartRate.bpm}
            </span>
            <span style={{ fontSize: 14, color: theme.textMuted }}>bpm</span>
          </div>

          {/* Secondary metrics */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              background: 'rgba(111,98,87,0.05)',
              borderRadius: 12,
              padding: '12px 8px',
              border: `1px solid ${theme.border}`,
            }}
          >
            <Metric label="HRV" value={heartRate.hrv} unit="ms" />
            <div style={{ width: 1, background: theme.border }} aria-hidden="true" />
            <Metric label="SpO₂" value={heartRate.spo2} unit="%" />
          </div>
        </>
      )}
    </section>
  );
}
