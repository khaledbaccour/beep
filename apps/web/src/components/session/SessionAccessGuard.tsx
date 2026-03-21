'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { checkSessionAccess, SessionAccessResponse } from '@/lib/api';
import { SessionPage } from './SessionPage';

interface SessionAccessGuardProps {
  roomId: string;
  lang: string;
}

type GuardState =
  | { type: 'loading' }
  | { type: 'allowed'; data: SessionAccessResponse }
  | { type: 'too_early'; data: SessionAccessResponse }
  | { type: 'expired' }
  | { type: 'error'; message: string };

export function SessionAccessGuard({ roomId, lang }: SessionAccessGuardProps) {
  const router = useRouter();
  const [state, setState] = useState<GuardState>({ type: 'loading' });
  const [countdown, setCountdown] = useState<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkAccess = useCallback(async () => {
    const token = localStorage.getItem('beep_token');
    if (!token) {
      router.replace(`/${lang}/login`);
      return;
    }

    try {
      const response = await checkSessionAccess(roomId, token);
      const data = response.data;

      if (data.allowed) {
        setState({ type: 'allowed', data });
        // Clear polling
        if (pollRef.current) clearInterval(pollRef.current);
        if (tickRef.current) clearInterval(tickRef.current);
      } else if (data.reason === 'TOO_EARLY') {
        setState({ type: 'too_early', data });
        setCountdown((data.minutesUntilStart ?? 0) * 60);
      } else if (data.reason === 'EXPIRED') {
        setState({ type: 'expired' });
      } else if (data.reason === 'FORBIDDEN') {
        setState({ type: 'error', message: 'You are not authorized to join this session.' });
      } else {
        setState({ type: 'error', message: 'Session not found.' });
      }
    } catch {
      setState({ type: 'error', message: 'Unable to verify session access.' });
    }
  }, [roomId, lang, router]);

  useEffect(() => {
    checkAccess();

    // Poll every 30 seconds
    pollRef.current = setInterval(checkAccess, 30000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [checkAccess]);

  // Countdown ticker
  useEffect(() => {
    if (state.type !== 'too_early') return;

    tickRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          checkAccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [state.type, checkAccess]);

  if (state.type === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-peach-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-ink-400 font-body text-sm">Checking session access...</p>
        </div>
      </div>
    );
  }

  if (state.type === 'allowed') {
    return (
      <SessionPage
        roomId={roomId}
        lang={lang}
        scheduledStartTime={new Date(state.data.scheduledStartTime!)}
        scheduledEndTime={new Date(state.data.scheduledEndTime!)}
      />
    );
  }

  if (state.type === 'too_early') {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;
    const timeStr = hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const sessionDate = state.data.scheduledStartTime
      ? new Date(state.data.scheduledStartTime).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';
    const sessionTime = state.data.scheduledStartTime
      ? new Date(state.data.scheduledStartTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '';

    return (
      <div className="flex h-screen flex-col items-center justify-center bg-ink-950 gap-8 px-4">
        <div className="w-20 h-20 rounded-2xl bg-ink-800 border-2 border-ink-700 flex items-center justify-center">
          <ClockIcon className="w-10 h-10 text-peach-500" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Your session is almost ready
          </h2>
          <p className="text-ink-400 font-body text-sm">
            {state.data.expertName && `with ${state.data.expertName}`}
            {sessionDate && ` on ${sessionDate}`}
            {sessionTime && ` at ${sessionTime}`}
          </p>
        </div>

        <div className="bg-ink-800 border-2 border-ink-700 rounded-2xl px-10 py-6">
          <p className="text-5xl font-mono font-bold text-peach-500 tracking-widest tabular-nums">
            {timeStr}
          </p>
        </div>

        <p className="text-ink-500 font-body text-xs text-center max-w-xs">
          You&apos;ll be admitted 5 minutes before your scheduled start time.
          This page will update automatically.
        </p>

        <button
          onClick={() => router.push(`/${lang}/dashboard`)}
          className="text-ink-500 hover:text-ink-300 text-sm font-body underline transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (state.type === 'expired') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-ink-950 gap-6">
        <div className="w-16 h-16 rounded-2xl bg-ink-800 border-2 border-ink-700 flex items-center justify-center">
          <ClockIcon className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-display font-bold text-white">Session has ended</h2>
        <p className="text-ink-400 font-body text-sm">This session is no longer available.</p>
        <button
          onClick={() => router.push(`/${lang}/dashboard`)}
          className="mt-2 px-6 py-2.5 rounded-full bg-peach-500 text-ink-950 font-bold text-sm border-2 border-ink-950 shadow-retro hover:-translate-y-0.5 hover:shadow-retro-md transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-ink-950 gap-6">
      <div className="w-16 h-16 rounded-2xl bg-ink-800 border-2 border-ink-700 flex items-center justify-center">
        <ExclamationIcon className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-xl font-display font-bold text-white">Access Denied</h2>
      <p className="text-ink-400 font-body text-sm">{state.message}</p>
      <button
        onClick={() => router.push(`/${lang}/dashboard`)}
        className="mt-2 px-6 py-2.5 rounded-full bg-peach-500 text-ink-950 font-bold text-sm border-2 border-ink-950 shadow-retro hover:-translate-y-0.5 hover:shadow-retro-md transition-all"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ExclamationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
