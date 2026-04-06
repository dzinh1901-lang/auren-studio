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

type DashboardLayoutProps = {
  header: React.ReactNode;
  leftSidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar: React.ReactNode;
};

export default function DashboardLayout({
  header,
  leftSidebar,
  mainContent,
  rightSidebar,
}: DashboardLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        fontFamily: 'Outfit, system-ui, sans-serif',
      }}
    >
      {/* Responsive styles */}
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 280px 1fr 300px;
          gap: 20px;
          padding: 20px 24px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (max-width: 1100px) {
          .dashboard-grid {
            grid-template-columns: 260px 1fr;
          }
          .dashboard-right {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 720px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            padding: 12px 14px 40px;
            gap: 14px;
          }
        }
      `}</style>

      {/* Header */}
      {header}

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Left sidebar */}
        <aside
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          aria-label="Left sidebar"
        >
          {leftSidebar}
        </aside>

        {/* Main content */}
        <main
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          aria-label="Main content"
        >
          {mainContent}
        </main>

        {/* Right sidebar */}
        <aside
          className="dashboard-right"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          aria-label="Right sidebar"
        >
          {rightSidebar}
        </aside>
      </div>
    </div>
  );
}
