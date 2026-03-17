'use client';

import { useEffect, useState } from 'react';
import type { BookingResponse } from '@/lib/api';
import { getExpertBookings, getMyBookings } from '@/lib/api';
import type { TabProps } from './types';
import { BookingRow } from './BookingRow';

interface BookingsTabProps extends TabProps {
  isExpert: boolean;
}

type BookingFilter = 'upcoming' | 'past' | 'cancelled';

const FILTER_EMOJI: Record<BookingFilter, string> = {
  upcoming: '🔜',
  past: '✅',
  cancelled: '❌',
};

export function BookingsTab({ d, lang, isExpert }: BookingsTabProps) {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingFilter>('upcoming');

  useEffect(() => {
    const fetcher = isExpert ? getExpertBookings : getMyBookings;
    fetcher()
      .then((res) => setBookings(res.data ?? []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [isExpert]);

  const now = new Date();
  const filtered = bookings.filter((b) => {
    const start = new Date(b.scheduledStartTime);
    if (filter === 'upcoming') return start > now && !b.status.startsWith('CANCELLED');
    if (filter === 'past') return (start <= now || b.status === 'COMPLETED') && !b.status.startsWith('CANCELLED');
    return b.status.startsWith('CANCELLED');
  });

  const filters: { key: BookingFilter; label: string }[] = [
    { key: 'upcoming', label: d.upcoming },
    { key: 'past', label: d.past },
    { key: 'cancelled', label: d.cancelled },
  ];

  return (
    <div className="rounded-2xl border-[2.5px] border-ink-900 bg-white p-6 shadow-retro">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-lg font-display font-bold text-ink-900">{d.bookings}</h2>

        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-[2.5px] transition-all duration-200 ${
                filter === f.key
                  ? 'bg-ink-900 text-white border-ink-900 shadow-retro-sm -translate-y-0.5'
                  : 'bg-white text-ink-500 border-ink-900 hover:bg-ink-50 hover:-translate-y-0.5 hover:shadow-retro-sm'
              }`}
            >
              <span>{FILTER_EMOJI[f.key]}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-8 justify-center">
          <div className="w-5 h-5 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
          <p className="text-sm text-ink-400">{d.loading}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 px-4">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm text-ink-400 font-medium">{d.noBookings}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingRow key={b.id} booking={b} d={d} lang={lang} isExpert={isExpert} />
          ))}
        </div>
      )}
    </div>
  );
}
