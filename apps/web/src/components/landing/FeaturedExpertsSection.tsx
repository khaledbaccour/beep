'use client';

import { Star, ArrowRight, ArrowUpRight, CheckCircle2, Users } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const experts = [
  { name: 'Yassine Bouaziz', slug: 'yassine', role: 'Fitness Coach', rating: 4.9, sessions: 340, price: 35, initials: 'YB', accent: '#FFB088', tags: ['Weight Loss', 'HIIT', 'Nutrition'] },
  { name: 'Amira Ben Salem', slug: 'amira', role: 'Graphic Designer', rating: 5.0, sessions: 512, price: 80, initials: 'AB', accent: '#C4B5FD', tags: ['Branding', 'Logo Design', 'UI/UX'] },
  { name: 'Mehdi Trabelsi', slug: 'mehdi', role: 'Software Engineer', rating: 4.8, sessions: 189, price: 50, initials: 'MT', accent: '#93C5FD', tags: ['React', 'System Design', 'Career'] },
  { name: 'Sana Khlifi', slug: 'sana', role: 'Business Consultant', rating: 4.9, sessions: 267, price: 65, initials: 'SK', accent: '#86EFAC', tags: ['Startup', 'Strategy', 'Marketing'] },
  { name: 'Khalil Jebali', slug: 'khalil', role: 'English Teacher', rating: 4.7, sessions: 421, price: 25, initials: 'KJ', accent: '#FDE68A', tags: ['IELTS', 'Business English'] },
  { name: 'Ines Maalej', slug: 'ines', role: 'Life Coach', rating: 5.0, sessions: 198, price: 70, initials: 'IM', accent: '#F9A8D4', tags: ['Productivity', 'Mindset', 'Career Change'] },
];

export function FeaturedExpertsSection({ dict, lang }: Props) {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: '#FAF5F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header - Creem style centered */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#141418] text-xs font-bold uppercase tracking-wider text-[#141418] mb-6">
            <Users size={14} strokeWidth={2.5} />
            {dict.featured.label}
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[#141418] tracking-tight leading-[1.1]">
            {dict.featured.title}
          </h2>
        </div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {experts.map((expert) => (
            <a
              key={expert.slug}
              href={localePath(lang, `/${expert.slug}`)}
              className="group flex-shrink-0 w-[300px] sm:w-[320px] lg:w-auto snap-start rounded-2xl border-2 border-[#141418] overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#141418]"
            >
              {/* Top section */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl border-2 border-[#141418] flex items-center justify-center text-[#141418] text-base font-bold"
                    style={{ backgroundColor: expert.accent }}
                  >
                    {expert.initials}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          fill={s <= Math.floor(expert.rating) ? '#141418' : '#E5E7EB'}
                          stroke="none"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#141418]">{expert.rating}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-display font-bold text-[#141418]">
                      {expert.name}
                    </h3>
                    <CheckCircle2 size={16} className="text-[#141418]" />
                  </div>
                  <p className="text-sm font-medium text-[#141418]/60">
                    {expert.role}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {expert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-bold rounded-full border-2 border-[#141418]/15 text-[#141418]/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar - dark */}
              <div className="px-6 py-4 bg-[#141418] flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-bold text-white">
                    {expert.price}
                  </span>
                  <span className="text-sm text-white/60">{dict.common.tnd}</span>
                  <span className="text-xs text-white/40 ml-1">
                    / {dict.featured.sessions.slice(0, -1)}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-200">
                  <ArrowUpRight size={16} className="text-white group-hover:text-[#141418] transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <a
            href={localePath(lang, '/marketplace')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-[#141418] bg-[#141418] text-sm font-bold text-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#141418] transition-all duration-200"
          >
            {dict.featured.viewAll}
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
