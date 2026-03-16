'use client';

import { useEffect, useState } from 'react';

interface SessionTimerProps {
  startTime: Date;
  durationMin: number;
  graceMin: number;
  onExpired: () => void;
}

export function SessionTimer({ startTime, durationMin, graceMin, onExpired }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  const scheduledSec = durationMin * 60;
  const totalSec = (durationMin + graceMin) * 60;
  const warningSec = scheduledSec - 5 * 60;

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setElapsed(diff);

      if (diff >= totalSec) {
        clearInterval(interval);
        onExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, totalSec, onExpired]);

  const remaining = Math.max(0, scheduledSec - elapsed);
  const isWarning = elapsed >= warningSec && remaining > 0;
  const isGrace = elapsed >= scheduledSec;

  return (
    <div
      role="timer"
      aria-label={`${formatDuration(remaining)} remaining`}
      className={`px-4 py-1.5 rounded-full border-2 font-mono text-sm font-bold transition-colors ${
        isGrace
          ? 'bg-red-500/20 border-red-500 text-red-400'
          : isWarning
            ? 'bg-peach-700/20 border-peach-600 text-peach-400 animate-pulse'
            : 'bg-ink-800/80 border-ink-700 text-ink-300'
      }`}
    >
      <span className="text-ink-500 mr-2">{formatDuration(elapsed)}</span>
      <span>/</span>
      <span className="ml-2">
        {isGrace
          ? <>Grace: -{formatDuration(elapsed - scheduledSec)}</>
          : <>{formatDuration(remaining)} left</>
        }
      </span>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
