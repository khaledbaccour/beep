'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, DollarSign, Video, TrendingUp, ArrowUpRight } from 'lucide-react';
import type { BookingResponse } from '@/lib/api';
import { getExpertBookings } from '@/lib/api';
import type { TabProps } from './types';
import { centsToEUR } from './types';
import { BookingRow } from './BookingRow';

const STAT_THEMES = [
  {
    bg: 'bg-gradient-to-br from-peach-100 to-peach-50',
    border: 'border-peach-300',
    iconBg: 'bg-peach-500',
    accent: 'text-peach-700',
  },
  {
    bg: 'bg-gradient-to-br from-success-50 to-success-50/50',
    border: 'border-success-100',
    iconBg: 'bg-success-500',
    accent: 'text-success-700',
  },
  {
    bg: 'bg-gradient-to-br from-brand-50 to-brand-100/50',
    border: 'border-brand-200',
    iconBg: 'bg-brand-600',
    accent: 'text-brand-700',
  },
];

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
  const totalEarnings = completed.reduce((sum, b) => sum + b.amountCents, 0);

  const stats = [
    { label: d.upcomingSessions, value: loading ? '—' : String(upcoming.length), icon: CalendarDays },
    { label: d.totalEarnings, value: loading ? '—' : `${centsToEUR(totalEarnings)} EUR`, icon: DollarSign },
    { label: d.totalSessions, value: loading ? '—' : String(completed.length), icon: Video },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const theme = STAT_THEMES[i];
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`relative rounded-2xl border-[2.5px] border-ink-900 ${theme.bg} p-5 shadow-retro transition-all duration-200 hover:-translate-y-0.5 hover:shadow-retro-md overflow-hidden group`}
            >
              {/* Decorative circle */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <ArrowUpRight size={16} className="text-ink-300 group-hover:text-ink-500 transition-colors" />
                </div>
                <p className="text-3xl font-display font-bold text-ink-900 mb-1">{stat.value}</p>
                <p className="text-xs text-ink-500 font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming sessions */}
      <div className="rounded-2xl border-[2.5px] border-ink-900 bg-white p-6 shadow-retro">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <h2 className="text-base font-display font-bold text-ink-900">{d.upcomingSessions}</h2>
          </div>
          {upcoming.length > 0 && (
            <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">
              {upcoming.length} {upcoming.length === 1 ? 'session' : 'sessions'}
            </span>
          )}
        </div>
        {loading ? (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="w-5 h-5 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
            <p className="text-sm text-ink-400">{d.loading}</p>
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm text-ink-400 font-medium">{d.noBookings}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map((b) => (
              <BookingRow key={b.id} booking={b} d={d} lang={lang} isExpert />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
