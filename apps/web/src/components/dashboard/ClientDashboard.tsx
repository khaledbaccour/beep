'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Video, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localePath } from '@/lib/i18n-utils';
import type { BookingResponse } from '@/lib/api';
import { getMyBookings } from '@/lib/api';
import type { TabProps } from './types';
import { BookingRow } from './BookingRow';

export function ClientDashboard({ d, lang }: TabProps) {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.data ?? []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => new Date(b.scheduledStartTime) > now && !b.status.startsWith('CANCELLED'),
  );
  const past = bookings.filter(
    (b) => new Date(b.scheduledStartTime) <= now || b.status === 'COMPLETED',
  );

  const stats = [
    { label: d.upcomingSessions, value: loading ? '-' : String(upcoming.length), icon: CalendarDays, color: '#4A7FF7' },
    { label: d.totalSessions, value: loading ? '-' : String(past.length), icon: Video, color: '#2DBDA8' },
  ];

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
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

      <div className="mb-8">
        <a href={localePath(lang, '/marketplace')}>
          <Button variant="outline" size="sm" className="gap-2">
            <Search size={14} />
            {d.browseExperts}
          </Button>
        </a>
      </div>

      <div className="rounded-2xl border-2 border-ink-900 bg-white p-6 shadow-retro">
        <h2 className="text-base font-display font-bold text-ink-900 mb-4">{d.myBookings}</h2>
        {loading ? (
          <p className="text-sm text-ink-400">{d.loading}</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-ink-400">{d.noBookings}</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <BookingRow key={b.id} booking={b} d={d} lang={lang} isExpert={false} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
