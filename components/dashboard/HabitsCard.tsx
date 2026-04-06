import React from 'react';
import type { Habit } from '@/lib/dashboard/types';
import { useHabitToggle } from '@/hooks/useDashboardMutations';
import EmptyState from './EmptyState';

const theme = {
  bg: '#F7F2EB',
  card: '#FAF7F2',
  surface: '#EFE6DA',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
  success: '#34C97B',
};

type HabitsCardProps = {
  habits: Habit[];
};

function HabitRow({ habit }: { habit: Habit }) {
  const { mutate: toggle, isPending } = useHabitToggle();

  const handleToggle = () => {
    if (isPending) return;
    toggle({ habitId: habit.id, completed: !habit.completed });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <button
        onClick={handleToggle}
        disabled={isPending}
        aria-label={`${habit.completed ? 'Unmark' : 'Mark'} ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
        aria-pressed={habit.completed}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `2px solid ${habit.completed ? theme.success : theme.border}`,
          background: habit.completed ? theme.success : 'transparent',
          cursor: isPending ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {habit.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div style={{ flex: 1 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: habit.completed ? theme.textMuted : theme.textPrimary,
            textDecoration: habit.completed ? 'line-through' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {habit.name}
        </span>
      </div>

      {habit.streak > 0 && (
        <span
          aria-label={`${habit.streak} day streak`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '3px 10px',
            borderRadius: 100,
            background: `rgba(201,169,110,0.12)`,
            fontSize: 12,
            fontWeight: 600,
            color: theme.gold,
          }}
        >
          🔥 {habit.streak}
        </span>
      )}
    </div>
  );
}

export default function HabitsCard({ habits }: HabitsCardProps) {
  const completed = habits.filter((h) => h.completed).length;

  return (
    <section
      aria-label="Daily Habits"
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: '24px 24px 16px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 2px 12px rgba(75,64,56,0.05)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
          Daily Habits
        </h2>
        <span style={{ fontSize: 13, color: theme.textMuted, fontWeight: 500 }}>
          {completed}/{habits.length}
        </span>
      </div>

      {/* Progress bar */}
      {habits.length > 0 && (
        <div
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={habits.length}
          aria-label={`${completed} of ${habits.length} habits completed`}
          style={{
            height: 4,
            borderRadius: 2,
            background: `rgba(111,98,87,0.1)`,
            marginBottom: 16,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${habits.length > 0 ? (completed / habits.length) * 100 : 0}%`,
              background: theme.success,
              borderRadius: 2,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      )}

      {/* Habit list */}
      {habits.length === 0 ? (
        <EmptyState icon="✅" title="No habits yet" message="Your daily habits will appear here." />
      ) : (
        <div>
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </section>
  );
}
