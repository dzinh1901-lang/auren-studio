import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReflectionAnalyze } from '@/hooks/useDashboardMutations';

const theme = {
  card: '#FAF7F2',
  surface: '#EFE6DA',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
  success: '#34C97B',
  warning: '#F5A623',
};

const AUTOSAVE_DELAY_MS = 3000;
const MIN_CONTENT_LENGTH = 3;

export default function ReflectionCard() {
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: analyze } = useReflectionAnalyze();

  const save = useCallback(
    (text: string) => {
      if (text.trim().length < MIN_CONTENT_LENGTH) return;
      setStatus('saving');
      analyze(
        { content: text.trim() },
        {
          onSuccess: (data) => {
            setSavedContent(text);
            setInsight(data.insight);
            setStatus('saved');
          },
          onError: () => {
            setStatus('error');
          },
        }
      );
    },
    [analyze]
  );

  // Debounced autosave
  useEffect(() => {
    if (content === savedContent || content.trim().length < MIN_CONTENT_LENGTH) return;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      save(content);
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [content, savedContent, save]);

  const isUnsaved = content !== savedContent && content.trim().length >= MIN_CONTENT_LENGTH;

  return (
    <section
      aria-label="Reflection Journal"
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 2px 12px rgba(75,64,56,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
          Journal
        </h2>
        {/* Status indicator */}
        <span
          aria-live="polite"
          aria-atomic="true"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color:
              status === 'saved'
                ? theme.success
                : status === 'saving'
                ? theme.gold
                : status === 'error'
                ? '#E8445A'
                : isUnsaved
                ? theme.warning
                : theme.textMuted,
          }}
        >
          {status === 'saving'
            ? 'Saving…'
            : status === 'saved'
            ? '✓ Saved'
            : status === 'error'
            ? '✗ Save failed'
            : isUnsaved
            ? '● Unsaved'
            : ''}
        </span>
      </div>

      {/* Textarea */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(content);
        }}
      >
        <label htmlFor="reflection-input" style={{ display: 'none' }}>
          Journal entry
        </label>
        <textarea
          id="reflection-input"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (status === 'saved' || status === 'error') setStatus('idle');
          }}
          placeholder="What's on your mind today? Write freely…"
          rows={5}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            background: theme.surface,
            fontSize: 14,
            color: theme.textPrimary,
            lineHeight: 1.7,
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          aria-label="Journal entry — autosaves every 3 seconds"
          aria-multiline="true"
        />

        {/* Manual save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="submit"
            disabled={content.trim().length < MIN_CONTENT_LENGTH || status === 'saving'}
            style={{
              padding: '8px 18px',
              borderRadius: 100,
              background: theme.textPrimary,
              color: '#F7F2EB',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: content.trim().length < MIN_CONTENT_LENGTH ? 'not-allowed' : 'pointer',
              opacity: content.trim().length < MIN_CONTENT_LENGTH ? 0.5 : 1,
            }}
          >
            Reflect &amp; Analyze
          </button>
        </div>
      </form>

      {/* AI Insight */}
      {insight && (
        <div
          role="region"
          aria-label="AI Insight"
          style={{
            padding: '14px 16px',
            background: 'rgba(201,169,110,0.08)',
            borderRadius: 12,
            border: `1px solid rgba(201,169,110,0.2)`,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }} aria-hidden="true">
            💡
          </span>
          <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, margin: 0 }}>
            {insight}
          </p>
        </div>
      )}
    </section>
  );
}
