'use client';

import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function StatsSection({ dict, lang }: Props) {
  const stats = [
    { value: dict.stats.experts, label: dict.stats.expertsLabel, sub: dict.stats.expertsSub },
    { value: dict.stats.sessions, label: dict.stats.sessionsLabel, sub: dict.stats.sessionsSub },
    { value: dict.stats.rating, label: dict.stats.ratingLabel, sub: dict.stats.ratingSub },
    { value: dict.stats.booking, label: dict.stats.bookingLabel, sub: dict.stats.bookingSub },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-ink-900 p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`text-center ${i > 0 ? 'md:border-l md:border-ink-700' : ''}`}>
                <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white/70">{stat.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
