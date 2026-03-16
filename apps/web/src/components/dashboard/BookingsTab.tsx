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
    <div className="rounded-2xl border-2 border-ink-900 bg-white p-6 shadow-retro">
      <h2 className="text-lg font-display font-bold text-ink-900 mb-4">{d.bookings}</h2>

      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
              filter === f.key
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-white text-ink-500 border-ink-200 hover:border-ink-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink-400">{d.loading}</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-ink-400">{d.noBookings}</p>
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
