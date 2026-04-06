import React from 'react';

const shimmer: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(111,98,87,0.08) 25%, rgba(111,98,87,0.14) 50%, rgba(111,98,87,0.08) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.6s infinite',
  borderRadius: 8,
};

const block = (w: string | number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  ...shimmer,
  width: w,
  height: h,
  ...extra,
});

function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#FAF7F2',
        borderRadius: 20,
        padding: 24,
        border: '1px solid rgba(111,98,87,0.14)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
      aria-busy="true"
      aria-label="Loading…"
    >
      {children}
    </div>
  );
}

export default function LoadingState() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* WelcomeHero skeleton */}
        <SkeletonCard>
          <div style={block('60%', 22, { borderRadius: 6 })} />
          <div style={block('40%', 16, { borderRadius: 6 })} />
          <div style={block('80%', 14, { borderRadius: 6 })} />
        </SkeletonCard>

        {/* Habits skeleton */}
        <SkeletonCard>
          <div style={block('50%', 18, { borderRadius: 6 })} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={block(28, 28, { borderRadius: '50%', flexShrink: 0 })} />
              <div style={block('70%', 14, { borderRadius: 6 })} />
            </div>
          ))}
        </SkeletonCard>

        {/* Generic card */}
        <SkeletonCard>
          <div style={block('45%', 18, { borderRadius: 6 })} />
          <div style={block('100%', 60, { borderRadius: 12 })} />
        </SkeletonCard>
      </div>
    </>
  );
}
