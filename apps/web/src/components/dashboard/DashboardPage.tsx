'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';
import type { UserProfile, Tab } from './types';
import { OverviewTab } from './OverviewTab';
import { ProfileTab } from './ProfileTab';
import { AvailabilityTab } from './AvailabilityTab';
import { BookingsTab } from './BookingsTab';
import { ClientDashboard } from './ClientDashboard';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function DashboardPage({ dict, lang }: Props) {
  const d = dict.dashboard;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
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

  const isExpert = user.role === 'EXPERT';
  const expertTabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: d.overview },
    { key: 'profile', label: d.profile },
    { key: 'availability', label: d.availability },
    { key: 'bookings', label: d.bookings },
  ];

  return (
    <section className="pt-24 pb-20 min-h-screen bg-cream-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-sm text-ink-500 mb-1">
            {isExpert ? d.proDashboard : d.myAccount}
          </p>
          <h1 className="text-3xl font-display font-bold text-ink-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-ink-400 mt-1">{user.email}</p>
        </div>

        {isExpert && (
          <div className="flex gap-1 mb-8 overflow-x-auto pb-1 scrollbar-none">
            {expertTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border-2 transition-all ${
                  tab === t.key
                    ? 'bg-ink-900 text-white border-ink-900 shadow-retro-sm'
                    : 'bg-white text-ink-500 border-ink-200 hover:border-ink-300 hover:text-ink-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {isExpert ? (
          <>
            {tab === 'overview' && <OverviewTab d={d} lang={lang} />}
            {tab === 'profile' && <ProfileTab d={d} lang={lang} />}
            {tab === 'availability' && <AvailabilityTab d={d} lang={lang} />}
            {tab === 'bookings' && <BookingsTab d={d} lang={lang} isExpert />}
          </>
        ) : (
          <ClientDashboard d={d} lang={lang} />
        )}
      </div>
    </section>
  );
}
