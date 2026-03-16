'use client';

import { Star, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const experts = [
  { name: 'Yassine Bouaziz', slug: 'yassine', role: 'Fitness Coach', rating: 4.9, sessions: 340, price: 35, initials: 'YB', color: '#FF6B6B', bg: '#FFF1F0', tags: ['Weight Loss', 'HIIT', 'Nutrition'] },
  { name: 'Amira Ben Salem', slug: 'amira', role: 'Graphic Designer', rating: 5.0, sessions: 512, price: 80, initials: 'AB', color: '#2DBDA8', bg: '#EEFBF9', tags: ['Branding', 'Logo Design', 'UI/UX'] },
  { name: 'Mehdi Trabelsi', slug: 'mehdi', role: 'Software Engineer', rating: 4.8, sessions: 189, price: 50, initials: 'MT', color: '#4A7FF7', bg: '#EDF4FF', tags: ['React', 'System Design', 'Career'] },
  { name: 'Sana Khlifi', slug: 'sana', role: 'Business Consultant', rating: 4.9, sessions: 267, price: 65, initials: 'SK', color: '#6C5DD3', bg: '#F3F1FE', tags: ['Startup', 'Strategy', 'Marketing'] },
  { name: 'Khalil Jebali', slug: 'khalil', role: 'English Teacher', rating: 4.7, sessions: 421, price: 25, initials: 'KJ', color: '#E5960B', bg: '#FFF9EB', tags: ['IELTS', 'Business English'] },
  { name: 'Ines Maalej', slug: 'ines', role: 'Life Coach', rating: 5.0, sessions: 198, price: 70, initials: 'IM', color: '#D45DAF', bg: '#FDF1FA', tags: ['Productivity', 'Mindset', 'Career Change'] },
];

export function FeaturedExpertsSection({ dict, lang }: Props) {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-sm font-mono font-medium text-brand-500 mb-2">{dict.featured.label}</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
              {dict.featured.title}
            </h2>
          </div>
          <a
            href={localePath(lang, '/marketplace')}
            className="mt-4 sm:mt-0 text-sm font-medium text-ink-500 hover:text-ink-900 flex items-center gap-1.5 transition-colors group"
          >
            {dict.featured.viewAll}
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {experts.map((expert) => (
            <a
              key={expert.slug}
              href={localePath(lang, `/${expert.slug}`)}
              className="group flex-shrink-0 w-[300px] sm:w-[320px] lg:w-auto snap-start rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-elevated"
              style={{ backgroundColor: expert.bg }}
            >
              {/* Top section with avatar and rating */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-base font-bold shadow-sm"
                    style={{ backgroundColor: expert.color }}
                  >
                    {expert.initials}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          fill={s <= Math.floor(expert.rating) ? '#F59E0B' : '#E5E7EB'}
                          stroke="none"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-ink-700">{expert.rating}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-base font-display font-bold text-ink-900">
                      {expert.name}
                    </h3>
                    <CheckCircle2 size={14} style={{ color: expert.color }} />
                  </div>
                  <p className="text-xs font-medium" style={{ color: expert.color }}>
                    {expert.role}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {expert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white/80 text-ink-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-5 py-3.5 bg-white/50 border-t border-white/60 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-display font-bold text-ink-900">
                    {expert.price}
                  </span>
                  <span className="text-xs text-ink-400">{dict.common.tnd}</span>
                  <span className="text-[10px] text-ink-300 ml-1">
                    / {dict.featured.sessions.slice(0, -1)}
                  </span>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200"
                  style={{ backgroundColor: expert.color }}
                >
                  <ArrowUpRight size={14} className="text-white" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
