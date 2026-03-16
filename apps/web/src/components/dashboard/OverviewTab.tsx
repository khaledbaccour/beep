'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, DollarSign, Video } from 'lucide-react';
import type { BookingResponse } from '@/lib/api';
import { getExpertBookings } from '@/lib/api';
import type { TabProps } from './types';
import { millimesToTND } from './types';
import { BookingRow } from './BookingRow';

export function OverviewTab({ d, lang }: TabProps) {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpertBookings()
      .then((res) => setBookings(res.data ?? []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => new Date(b.scheduledStartTime) > now && !b.status.startsWith('CANCELLED'),
  );
  const completed = bookings.filter((b) => b.status === 'COMPLETED');
  const totalEarnings = completed.reduce((sum, b) => sum + b.amountMillimes, 0);

  const stats = [
    { label: d.upcomingSessions, value: loading ? '-' : String(upcoming.length), icon: CalendarDays, color: '#4A7FF7' },
    { label: d.totalEarnings, value: loading ? '-' : `${millimesToTND(totalEarnings)} TND`, icon: DollarSign, color: '#2DBDA8' },
    { label: d.totalSessions, value: loading ? '-' : String(completed.length), icon: Video, color: '#6C5DD3' },
  ];

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border-2 border-ink-900 bg-white p-5 shadow-retro">
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} style={{ color: stat.color }} />
                <span className="text-2xl font-display font-bold text-ink-900">{stat.value}</span>
              </div>
              <p className="text-xs text-ink-400 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border-2 border-ink-900 bg-white p-6 shadow-retro">
        <h2 className="text-base font-display font-bold text-ink-900 mb-4">{d.upcomingSessions}</h2>
        {loading ? (
          <p className="text-sm text-ink-400">{d.loading}</p>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-ink-400">{d.noBookings}</p>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map((b) => (
              <BookingRow key={b.id} booking={b} d={d} lang={lang} isExpert />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
