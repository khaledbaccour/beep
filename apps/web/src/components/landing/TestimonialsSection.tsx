'use client';

import { Star } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function TestimonialsSection({ dict, lang }: Props) {
  const testimonials = [
    {
      name: dict.testimonials.t1Name,
      role: dict.testimonials.t1Role,
      text: dict.testimonials.t1Text,
      initials: 'SM',
      gradient: 'from-pink-400 to-rose-400',
    },
    {
      name: dict.testimonials.t2Name,
      role: dict.testimonials.t2Role,
      text: dict.testimonials.t2Text,
      initials: 'KJ',
      gradient: 'from-emerald-400 to-teal-400',
    },
    {
      name: dict.testimonials.t3Name,
      role: dict.testimonials.t3Role,
      text: dict.testimonials.t3Text,
      initials: 'NT',
      gradient: 'from-violet-400 to-purple-400',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-ink-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-mono font-medium text-brand-500 mb-2">{dict.testimonials.label}</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
            {dict.testimonials.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-ink-200/60 bg-white p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" stroke="none" />
                ))}
              </div>

              <p className="text-sm text-ink-600 leading-relaxed flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-ink-100">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{t.name}</div>
                  <div className="text-xs text-ink-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
