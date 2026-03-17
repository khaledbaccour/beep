'use client';

import { BarChart3 } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const valueColors = [
  'text-violet-600',
  'text-[#E87C6A]',
  'text-emerald-600',
  'text-blue-600',
];

export function StatsSection({ dict, lang }: Props) {
  const stats = [
    { value: dict.stats.experts, label: dict.stats.expertsLabel, sub: dict.stats.expertsSub },
    { value: dict.stats.sessions, label: dict.stats.sessionsLabel, sub: dict.stats.sessionsSub },
    { value: dict.stats.rating, label: dict.stats.ratingLabel, sub: dict.stats.ratingSub },
    { value: dict.stats.booking, label: dict.stats.bookingLabel, sub: dict.stats.bookingSub },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ink-900 text-xs font-bold uppercase tracking-wider text-ink-900">
            <BarChart3 size={14} className="text-[#E87C6A]" />
            Numbers
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink-900 tracking-tight leading-tight">
            Trusted by <em className="italic text-[#E87C6A]">thousands</em>
          </h2>
        </div>

        {/* Stats container */}
        <div className="rounded-2xl border-2 border-ink-900 bg-white p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center ${i > 0 ? 'md:border-l-2 md:border-ink-200' : ''} flex flex-col items-center`}
              >
                <div className={`text-4xl sm:text-5xl font-extrabold ${valueColors[i]} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-base font-bold text-ink-900">
                  {stat.label}
                </div>
                <div className="text-sm text-ink-500 mt-1">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
