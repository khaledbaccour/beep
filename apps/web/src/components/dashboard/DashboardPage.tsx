'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, DollarSign, Users, Video } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CLIENT' | 'EXPERT' | 'ADMIN';
}

export function DashboardPage({ dict, lang }: Props) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('beep_user');
    if (!stored) {
      router.push(localePath(lang, '/login'));
      return;
    }
    setUser(JSON.parse(stored));
  }, [lang, router]);

  if (!user) return null;

  return (
    <section className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-sm text-ink-500 mb-1">
            {user.role === 'EXPERT' ? 'Pro Dashboard' : 'My Account'}
          </p>
          <h1 className="text-3xl font-display font-bold text-ink-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-ink-400 mt-1">{user.email} &middot; {user.role}</p>
        </div>

        {user.role === 'EXPERT' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Upcoming sessions', value: '3', icon: CalendarDays, color: '#4A7FF7' },
              { label: 'Total earnings', value: '1,240 TND', icon: DollarSign, color: '#2DBDA8' },
              { label: 'Total clients', value: '47', icon: Users, color: '#6C5DD3' },
              { label: 'Hours delivered', value: '62h', icon: Video, color: '#FF6B54' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-ink-200/60 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Icon size={20} style={{ color: stat.color }} />
                    <span className="text-2xl font-display font-bold text-ink-900">{stat.value}</span>
                  </div>
                  <p className="text-xs text-ink-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { label: 'Upcoming sessions', value: '1', icon: CalendarDays, color: '#4A7FF7' },
              { label: 'Past sessions', value: '5', icon: Video, color: '#2DBDA8' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-ink-200/60 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Icon size={20} style={{ color: stat.color }} />
                    <span className="text-2xl font-display font-bold text-ink-900">{stat.value}</span>
                  </div>
                  <p className="text-xs text-ink-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="rounded-xl border border-ink-200/60 bg-white p-6">
          <h2 className="text-base font-display font-bold text-ink-900 mb-4">Recent activity</h2>
          <p className="text-sm text-ink-400">No recent activity yet. Book a session to get started.</p>
        </div>
      </div>
    </section>
  );
}
