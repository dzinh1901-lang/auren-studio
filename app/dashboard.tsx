import React, { useMemo, useCallback } from 'react';
import { Sparkles, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  useWellnessToday,
  useGuidanceToday,
  useCoachMessage,
  useWeeklyAnalytics,
} from '@/hooks/useDashboardData';
import { transformWeeklyToGrowth } from '@/lib/dashboard/transformers';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeHero from '@/components/dashboard/WelcomeHero';
import HabitsCard from '@/components/dashboard/HabitsCard';
import MoodCard from '@/components/dashboard/MoodCard';
import SleepCard from '@/components/dashboard/SleepCard';
import HeartRateCard from '@/components/dashboard/HeartRateCard';
import GrowthJourney from '@/components/dashboard/GrowthJourney';
import GuidanceCard from '@/components/dashboard/GuidanceCard';
import WeeklyOverview from '@/components/dashboard/WeeklyOverview';
import AICoachCard from '@/components/dashboard/AICoachCard';
import ReflectionCard from '@/components/dashboard/ReflectionCard';
import RecentReflections from '@/components/dashboard/RecentReflections';
import LoadingState from '@/components/dashboard/LoadingState';
import ErrorState from '@/components/dashboard/ErrorState';

const theme = {
  bg: '#F7F2EB',
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
  accentDark: '#B8A48A',
};

// ─── Font & CSS injection (matches landing.tsx pattern) ───────────────────────

function injectFonts() {
  if (typeof document !== 'undefined') {
    const existing = document.getElementById('aurem-fonts');
    if (existing) return;
    const style = document.createElement('style');
    style.id = 'aurem-fonts';
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Outfit:wght@300;400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background-color: #F7F2EB;
        color: #4B4038;
        font-family: 'Outfit', sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .font-serif { font-family: 'Newsreader', Georgia, serif; }
      .font-sans  { font-family: 'Outfit', sans-serif; }
      ::selection { background: rgba(201,169,110,0.25); }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #F7F2EB; }
      ::-webkit-scrollbar-thumb { background: #D8C4A8; border-radius: 3px; }
    `;
    document.head.appendChild(style);
  }
}

// ─── Dashboard Header ─────────────────────────────────────────────────────────

function DashboardHeader({
  userName,
  onLogout,
}: {
  userName?: string | null;
  onLogout: () => void;
}) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(247,242,235,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
            aria-label="Back to home"
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.gold}, ${theme.accentDark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              <Sparkles size={14} color="#fff" />
            </div>
            <span
              className="font-serif"
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: theme.textPrimary,
                letterSpacing: '-0.02em',
                fontStyle: 'italic',
              }}
            >
              Aurem
            </span>
          </a>

          <div
            style={{
              width: 1,
              height: 20,
              background: theme.border,
              margin: '0 4px',
            }}
            aria-hidden="true"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LayoutDashboard size={14} color={theme.textMuted} aria-hidden="true" />
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.textSecondary }}>
              Dashboard
            </span>
          </div>
        </div>

        {/* User controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {userName && (
            <span style={{ fontSize: 13, color: theme.textMuted, fontWeight: 500 }}>
              {userName}
            </span>
          )}
          <button
            onClick={onLogout}
            aria-label="Sign out"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 100,
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <LogOut size={13} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Unauthenticated guard ────────────────────────────────────────────────────

function UnauthenticatedView() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.gold}, ${theme.accentDark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <Sparkles size={28} color="#fff" />
      </div>
      <div>
        <h1
          className="font-serif"
          style={{ fontSize: 28, fontWeight: 300, color: theme.textPrimary, marginBottom: 8 }}
        >
          Sign in to access your dashboard
        </h1>
        <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.6 }}>
          Your personalized wellness journey awaits.
        </p>
      </div>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 32px',
          borderRadius: 100,
          background: theme.textPrimary,
          color: theme.bg,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Return to Home
      </a>
    </div>
  );
}

// ─── Dashboard inner (authenticated) ─────────────────────────────────────────

function DashboardInner({ userName }: { userName?: string | null }) {
  const wellnessQuery = useWellnessToday();
  const guidanceQuery = useGuidanceToday(userName ?? undefined);
  const coachQuery = useCoachMessage(userName ?? undefined);
  const weeklyQuery = useWeeklyAnalytics();

  const growthCategories = useMemo(() => {
    if (!weeklyQuery.data) return [];
    return transformWeeklyToGrowth(weeklyQuery.data);
  }, [weeklyQuery.data]);

  const refetchGuidance = useCallback(() => {
    guidanceQuery.refetch();
  }, [guidanceQuery]);

  // Aggregate loading / error states
  const isLoading =
    wellnessQuery.isLoading || guidanceQuery.isLoading || coachQuery.isLoading || weeklyQuery.isLoading;

  const hasError =
    wellnessQuery.isError || guidanceQuery.isError || coachQuery.isError || weeklyQuery.isError;

  const refetchAll = useCallback(() => {
    wellnessQuery.refetch();
    guidanceQuery.refetch();
    coachQuery.refetch();
    weeklyQuery.refetch();
  }, [wellnessQuery, guidanceQuery, coachQuery, weeklyQuery]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        <LoadingState />
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ maxWidth: 600, margin: '48px auto', padding: '24px' }}>
        <ErrorState
          message="We couldn't load your wellness data. Please check your connection and try again."
          onRetry={refetchAll}
        />
      </div>
    );
  }

  const wellness = wellnessQuery.data!;
  const guidance = guidanceQuery.data!;
  const coach = coachQuery.data!;
  const weekly = weeklyQuery.data!;

  return (
    <DashboardLayout
      header={null}
      leftSidebar={
        <>
          <HabitsCard habits={wellness.habits} />
          <MoodCard mood={wellness.mood} />
          <SleepCard sleep={wellness.sleep} />
          <HeartRateCard heartRate={wellness.heartRate} />
        </>
      }
      mainContent={
        <>
          <WelcomeHero userName={userName} />
          <GrowthJourney categories={growthCategories} />
          <GuidanceCard
            guidance={guidance}
            onRefresh={refetchGuidance}
            isRefreshing={guidanceQuery.isFetching}
          />
          <WeeklyOverview weekly={weekly} />
        </>
      }
      rightSidebar={
        <>
          <AICoachCard message={coach} />
          <ReflectionCard />
          <RecentReflections entries={[]} />
        </>
      }
    />
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  injectFonts();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: theme.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-busy="true"
        aria-label="Loading dashboard…"
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `3px solid ${theme.border}`,
            borderTopColor: theme.gold,
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <UnauthenticatedView />;
  }

  return (
    <>
      <DashboardHeader userName={user.name} onLogout={logout} />
      <DashboardInner userName={user.name} />
    </>
  );
}
