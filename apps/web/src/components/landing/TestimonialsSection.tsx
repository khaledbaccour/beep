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
    <section className="py-24 sm:py-32 bg-[#FFF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Centered header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-ink-900 text-white text-xs font-bold uppercase tracking-wider mb-6">
            {dict.testimonials.label}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-normal">
            What people{' '}
            <em className="not-italic text-[#FFB088] italic">love</em>{' '}
            about us
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border-2 border-ink-900 bg-white p-7 flex flex-col shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,15,15,1)] hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="#FBBF24" stroke="#FBBF24" strokeWidth={1} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-ink-700 leading-relaxed flex-1 mb-7 font-medium">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Person */}
              <div className="flex items-center gap-3 pt-5 border-t-2 border-ink-900/10">
                <div
                  className={`w-10 h-10 rounded-full border-2 border-ink-900 bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-black`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-black text-ink-900">{t.name}</div>
                  <div className="text-xs text-ink-500 font-medium">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
