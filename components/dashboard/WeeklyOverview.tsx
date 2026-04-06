import React, { useMemo } from 'react';
import type { WeeklyAnalytics } from '@/lib/dashboard/types';
import { transformWeeklyToChartSeries } from '@/lib/dashboard/transformers';

const theme = {
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
};

type WeeklyOverviewProps = {
  weekly: WeeklyAnalytics;
};

function SparkLine({
  data,
  color,
  width = 260,
  height = 60,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  // Fill area below the line
  const fillPoints = [
    `0,${height}`,
    ...points,
    `${width},${height}`,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill={`url(#fill-${color.replace('#', '')})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last value dot */}
      {(() => {
        const lastPoint = points[points.length - 1];
        if (!lastPoint) return null;
        const coords = lastPoint.split(',');
        if (coords.length < 2) return null;
        return (
          <circle
            cx={parseFloat(coords[0]!)}
            cy={parseFloat(coords[1]!)}
            r="3"
            fill={color}
          />
        );
      })()}
    </svg>
  );
}

export default function WeeklyOverview({ weekly }: WeeklyOverviewProps) {
  const series = useMemo(() => transformWeeklyToChartSeries(weekly), [weekly]);

  return (
    <section
      aria-label="Weekly Overview"
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 2px 12px rgba(75,64,56,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
          Weekly Overview
        </h2>
        <div style={{ display: 'flex', gap: 12 }}>
          {series.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }}
                aria-hidden="true"
              />
              <span style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div
        style={{ overflowX: 'auto', paddingBottom: 4 }}
        role="img"
        aria-label="Line chart showing mind, body, heart and spirit scores over the past 7 days"
      >
        <div style={{ minWidth: 280, position: 'relative' }}>
          {/* Y-axis guides */}
          {[100, 75, 50, 25].map((mark) => (
            <div
              key={mark}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${(1 - mark / 100) * 100}%`,
                borderTop: `1px dashed rgba(111,98,87,0.1)`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 9, color: theme.textMuted, paddingRight: 4 }}>{mark}</span>
            </div>
          ))}

          {/* Lines */}
          <div style={{ paddingLeft: 20, paddingTop: 4 }}>
            {series.map((s) => (
              <div key={s.label} style={{ marginBottom: 4 }}>
                <SparkLine data={s.data} color={s.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 20 }}>
        {weekly.days.map((day) => (
          <span key={day} style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500 }}>
            {day}
          </span>
        ))}
      </div>
    </section>
  );
}
