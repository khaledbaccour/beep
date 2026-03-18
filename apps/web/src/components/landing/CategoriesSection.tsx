'use client';

import { Dumbbell, BookOpen, Palette, Scale, Briefcase, Code2, Sparkles, Globe, ArrowUpRight, LayoutGrid } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const categories = [
  { key: 'fitness' as const, descKey: 'fitnessDesc' as const, count: 127, icon: Dumbbell, bg: '#FFB088', apiName: 'FITNESS' },
  { key: 'education' as const, descKey: 'educationDesc' as const, count: 243, icon: BookOpen, bg: '#C4B5FD', apiName: 'EDUCATION' },
  { key: 'design' as const, descKey: 'designDesc' as const, count: 89, icon: Palette, bg: '#FDE68A', apiName: 'DESIGN' },
  { key: 'law' as const, descKey: 'lawDesc' as const, count: 64, icon: Scale, bg: '#FFCDB2', apiName: 'LAW' },
  { key: 'business' as const, descKey: 'businessDesc' as const, count: 156, icon: Briefcase, bg: '#93C5FD', apiName: 'BUSINESS' },
  { key: 'technology' as const, descKey: 'technologyDesc' as const, count: 198, icon: Code2, bg: '#86EFAC', apiName: 'TECHNOLOGY' },
  { key: 'coaching' as const, descKey: 'coachingDesc' as const, count: 73, icon: Sparkles, bg: '#F9A8D4', apiName: 'COACHING' },
  { key: 'languages' as const, descKey: 'languagesDesc' as const, count: 112, icon: Globe, bg: '#C4B5FD', apiName: 'LANGUAGES' },
];

export function CategoriesSection({ dict, lang }: Props) {
  const [first, second, ...rest] = categories;

  return (
    <section id="categories" className="py-20 sm:py-28" style={{ backgroundColor: '#FAF5F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header - Creem style centered */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#141418] text-xs font-bold uppercase tracking-wider text-[#141418] mb-6">
            <LayoutGrid size={14} strokeWidth={2.5} />
            {dict.categories.label}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141418] tracking-normal leading-[1.15]">
            {dict.categories.title}{' '}
            <em className="not-italic italic" style={{ color: '#FFB088' }}>{dict.categories.titleBreak}</em>
          </h2>
        </div>

        {/* Bento grid: 2 large + 6 small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Two featured categories -- span 2 cols each on large */}
          {[first, second].map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.key}
                href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                className="group relative lg:col-span-2 rounded-2xl border-2 border-[#141418] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#141418]"
                style={{ backgroundColor: cat.bg }}
              >
                {/* Decorative oversized icon */}
                <div className="absolute -bottom-6 -right-6 opacity-[0.12]">
                  <Icon size={180} className="text-[#141418]" strokeWidth={0.8} />
                </div>

                <div className="relative p-7 sm:p-8 flex flex-col justify-between min-h-[200px]">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-xl border-2 border-[#141418] bg-white/40 flex items-center justify-center">
                      <Icon size={26} className="text-[#141418]" strokeWidth={2} />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#141418] bg-white/50 text-xs font-bold text-[#141418]">
                      {cat.count} {dict.categories.expertCount}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#141418] mb-1.5">
                      {dict.categories[cat.key]}
                    </h3>
                    <p className="text-sm text-[#141418]/70 leading-relaxed max-w-xs">
                      {dict.categories[cat.descKey]}
                    </p>
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-7 right-7 w-9 h-9 rounded-full border-2 border-[#141418] bg-[#141418] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0">
                  <ArrowUpRight size={16} className="text-white" />
                </div>
              </a>
            );
          })}

          {/* Remaining 6 categories -- compact cards */}
          {rest.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.key}
                href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                className="group relative rounded-2xl border-2 border-[#141418] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#141418]"
                style={{ backgroundColor: cat.bg }}
              >
                {/* Subtle oversized icon */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.10]">
                  <Icon size={100} className="text-[#141418]" strokeWidth={0.8} />
                </div>

                <div className="relative p-5 flex flex-col justify-between min-h-[160px]">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-lg border-2 border-[#141418] bg-white/40 flex items-center justify-center">
                      <Icon size={20} className="text-[#141418]" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-bold text-[#141418]/60">
                      {cat.count}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-sm font-bold text-[#141418] group-hover:text-[#141418] transition-colors mb-0.5">
                      {dict.categories[cat.key]}
                    </h3>
                    <p className="text-xs text-[#141418]/60 leading-relaxed line-clamp-2">
                      {dict.categories[cat.descKey]}
                    </p>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-5 right-5 w-7 h-7 rounded-full border-2 border-[#141418] bg-[#141418] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
                  <ArrowUpRight size={12} className="text-white" />
                </div>
              </a>
            );
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <a
            href={localePath(lang, '/marketplace')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#141418] bg-white text-sm font-bold text-[#141418] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#141418] transition-all duration-200"
          >
            {dict.featured.viewAll}
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
