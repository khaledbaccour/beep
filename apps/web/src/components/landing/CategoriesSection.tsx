'use client';

import { Dumbbell, BookOpen, Palette, Scale, Briefcase, Code2, Sparkles, Globe, ArrowUpRight } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const categories = [
  { key: 'fitness' as const, descKey: 'fitnessDesc' as const, count: 127, icon: Dumbbell, bg: '#FFF1F0', accent: '#FF6B6B', apiName: 'FITNESS' },
  { key: 'education' as const, descKey: 'educationDesc' as const, count: 243, icon: BookOpen, bg: '#EEFBF9', accent: '#2DBDA8', apiName: 'EDUCATION' },
  { key: 'design' as const, descKey: 'designDesc' as const, count: 89, icon: Palette, bg: '#FFF9EB', accent: '#E5960B', apiName: 'DESIGN' },
  { key: 'law' as const, descKey: 'lawDesc' as const, count: 64, icon: Scale, bg: '#FDF5ED', accent: '#C88A3E', apiName: 'LAW' },
  { key: 'business' as const, descKey: 'businessDesc' as const, count: 156, icon: Briefcase, bg: '#F3F1FE', accent: '#6C5DD3', apiName: 'BUSINESS' },
  { key: 'technology' as const, descKey: 'technologyDesc' as const, count: 198, icon: Code2, bg: '#EDF4FF', accent: '#4A7FF7', apiName: 'TECHNOLOGY' },
  { key: 'coaching' as const, descKey: 'coachingDesc' as const, count: 73, icon: Sparkles, bg: '#FDF1FA', accent: '#D45DAF', apiName: 'COACHING' },
  { key: 'languages' as const, descKey: 'languagesDesc' as const, count: 112, icon: Globe, bg: '#EDFAF4', accent: '#38A97B', apiName: 'LANGUAGES' },
];

export function CategoriesSection({ dict, lang }: Props) {
  const [first, second, ...rest] = categories;

  return (
    <section id="categories" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-mono font-medium text-brand-500 mb-2">{dict.categories.label}</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
              {dict.categories.title}<br className="hidden sm:block" /> {dict.categories.titleBreak}
            </h2>
          </div>
          <a
            href={localePath(lang, '/marketplace')}
            className="text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors flex items-center gap-1 group shrink-0"
          >
            {dict.featured.viewAll}
            <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Bento grid: 2 large + 6 small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Two featured categories — span 2 cols each on large */}
          {[first, second].map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.key}
                href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                className="group relative lg:col-span-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-elevated"
                style={{ backgroundColor: cat.bg }}
              >
                {/* Decorative oversized icon */}
                <div className="absolute -bottom-6 -right-6 opacity-[0.07]">
                  <Icon size={180} style={{ color: cat.accent }} strokeWidth={0.8} />
                </div>

                <div className="relative p-7 sm:p-8 flex flex-col justify-between min-h-[180px]">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${cat.accent}18` }}
                    >
                      <Icon size={24} style={{ color: cat.accent }} strokeWidth={1.8} />
                    </div>
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{ backgroundColor: `${cat.accent}14`, color: cat.accent }}
                    >
                      {cat.count} {dict.categories.expertCount}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3
                      className="text-lg font-display font-bold mb-1"
                      style={{ color: cat.accent }}
                    >
                      {dict.categories[cat.key]}
                    </h3>
                    <p className="text-sm text-ink-500 leading-relaxed max-w-xs">
                      {dict.categories[cat.descKey]}
                    </p>
                  </div>
                </div>

                {/* Hover arrow */}
                <div
                  className="absolute top-7 right-7 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0"
                  style={{ backgroundColor: cat.accent }}
                >
                  <ArrowUpRight size={14} className="text-white" />
                </div>
              </a>
            );
          })}

          {/* Remaining 6 categories — compact cards */}
          {rest.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.key}
                href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-elevated"
                style={{ backgroundColor: cat.bg }}
              >
                {/* Subtle oversized icon */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.06]">
                  <Icon size={100} style={{ color: cat.accent }} strokeWidth={0.8} />
                </div>

                <div className="relative p-5 flex flex-col justify-between min-h-[150px]">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${cat.accent}18` }}
                    >
                      <Icon size={20} style={{ color: cat.accent }} strokeWidth={1.8} />
                    </div>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: cat.accent, opacity: 0.7 }}
                    >
                      {cat.count}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-[13px] font-bold text-ink-800 group-hover:text-ink-950 transition-colors mb-0.5">
                      {dict.categories[cat.key]}
                    </h3>
                    <p className="text-[11px] text-ink-400 leading-relaxed line-clamp-2">
                      {dict.categories[cat.descKey]}
                    </p>
                  </div>
                </div>

                {/* Hover indicator */}
                <div
                  className="absolute top-5 right-5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200"
                  style={{ backgroundColor: cat.accent }}
                >
                  <ArrowUpRight size={11} className="text-white" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
