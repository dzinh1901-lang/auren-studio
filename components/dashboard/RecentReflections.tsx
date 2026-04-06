import React, { useState } from 'react';
import type { ReflectionEntry } from '@/lib/dashboard/types';
import EmptyState from './EmptyState';

const theme = {
  card: '#FAF7F2',
  surface: '#EFE6DA',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
};

type RecentReflectionsProps = {
  entries?: ReflectionEntry[];
};

function formatRelativeDate(date: Date): string {
  try {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function EntryItem({ entry }: { entry: ReflectionEntry }) {
  const [expanded, setExpanded] = useState(false);
  const preview = entry.content.length > 100 ? `${entry.content.slice(0, 100)}…` : entry.content;

  return (
    <div
      style={{
        padding: '12px 0',
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500 }}>
          {formatRelativeDate(entry.createdAt)}
        </span>
        {entry.mood && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 100,
              background: 'rgba(201,169,110,0.12)',
              fontSize: 11,
              fontWeight: 600,
              color: theme.gold,
            }}
          >
            {entry.mood}
          </span>
        )}
      </div>

      <p
        style={{
          fontSize: 13,
          color: theme.textSecondary,
          lineHeight: 1.6,
          margin: 0,
          fontStyle: 'italic',
        }}
      >
        {expanded ? entry.content : preview}
      </p>

      {entry.content.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            fontSize: 11,
            color: theme.gold,
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
          }}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {entry.insight && (
        <p style={{ fontSize: 12, color: theme.textMuted, margin: 0, lineHeight: 1.5 }}>
          💡 {entry.insight}
        </p>
      )}
    </div>
  );
}

export default function RecentReflections({ entries }: RecentReflectionsProps) {
  const displayEntries = (entries ?? []).slice(0, 7);

  return (
    <section
      aria-label="Recent Reflections"
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 2px 12px rgba(75,64,56,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0, marginBottom: 8 }}>
        Recent Reflections
      </h2>

      {displayEntries.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No entries yet"
          message="Start journaling above to see your reflections here."
        />
      ) : (
        <div>
          {displayEntries.map((entry) => (
            <EntryItem key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
