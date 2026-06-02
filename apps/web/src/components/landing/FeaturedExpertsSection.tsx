'use client';

import { Star, ArrowRight, ArrowUpRight, CheckCircle2, Users } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import type { ExpertProfile } from '@/lib/api';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
  experts: ExpertProfile[];
}

const ACCENTS = ['#FFB088', '#C4B5FD', '#93C5FD', '#86EFAC', '#FDE68A', '#F9A8D4'];

function initialsOf(first: string, last: string): string {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

export function FeaturedExpertsSection({ dict, lang, experts }: Props) {
  // No featured experts → hide the section entirely rather than show fakes.
  if (!experts || experts.length === 0) return null;

  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: '#FAF5F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header - Creem style centered */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#141418] text-xs font-bold uppercase tracking-wider text-[#141418] mb-6">
            <Users size={14} strokeWidth={2.5} />
            {dict.featured.label}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141418] tracking-normal leading-[1.15]">
            {dict.featured.title}
          </h2>
        </div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {experts.map((expert, i) => {
            const fullName = `${expert.firstName} ${expert.lastName}`;
            const role = expert.headline || expert.category;
            const price = Math.round((expert.sessionPricePaise ?? 0) / 100);
            const tags = (expert.tags ?? []).slice(0, 3);
            return (
            <a
              key={expert.slug}
              href={localePath(lang, `/${expert.slug}`)}
              className="group flex-shrink-0 w-[300px] sm:w-[320px] lg:w-auto snap-start rounded-2xl border-2 border-[#141418] overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#141418]"
            >
              {/* Top section */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  {expert.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={expert.avatarUrl}
                      alt={fullName}
                      className="w-14 h-14 rounded-2xl border-2 border-[#141418] object-cover"
                      style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-2xl border-2 border-[#141418] flex items-center justify-center text-[#141418] text-base font-bold"
                      style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                    >
                      {initialsOf(expert.firstName, expert.lastName)}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          fill={s <= Math.floor(expert.averageRating) ? '#141418' : '#E5E7EB'}
                          stroke="none"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#141418]">{expert.averageRating}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-[#141418]">
                      {fullName}
                    </h3>
                    <CheckCircle2 size={16} className="text-[#141418]" />
                  </div>
                  <p className="text-sm font-medium text-[#141418]/60">
                    {role}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
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
                  <span className="text-2xl font-bold text-white">
                    {price}
                  </span>
                  <span className="text-sm text-white/60">{dict.common.inr}</span>
                  <span className="text-xs text-white/40 ml-1">
                    / {dict.featured.sessions.slice(0, -1)}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-200">
                  <ArrowUpRight size={16} className="text-white group-hover:text-[#141418] transition-colors" />
                </div>
              </div>
            </a>
            );
          })}
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
