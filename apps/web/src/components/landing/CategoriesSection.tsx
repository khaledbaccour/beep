'use client';

import { Dumbbell, BookOpen, Palette, Scale, Briefcase, Code2, Sparkles, Globe, ArrowRight } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const categories = [
  { key: 'fitness' as const, descKey: 'fitnessDesc' as const, count: 127, icon: Dumbbell, color: '#FF6B6B', bg: 'bg-red-50', border: 'hover:border-red-200', apiName: 'FITNESS' },
  { key: 'education' as const, descKey: 'educationDesc' as const, count: 243, icon: BookOpen, color: '#4ECDC4', bg: 'bg-teal-50', border: 'hover:border-teal-200', apiName: 'EDUCATION' },
  { key: 'design' as const, descKey: 'designDesc' as const, count: 89, icon: Palette, color: '#F59E0B', bg: 'bg-amber-50', border: 'hover:border-amber-200', apiName: 'DESIGN' },
  { key: 'law' as const, descKey: 'lawDesc' as const, count: 64, icon: Scale, color: '#DDA15E', bg: 'bg-orange-50', border: 'hover:border-orange-200', apiName: 'LAW' },
  { key: 'business' as const, descKey: 'businessDesc' as const, count: 156, icon: Briefcase, color: '#7C6FE0', bg: 'bg-violet-50', border: 'hover:border-violet-200', apiName: 'BUSINESS' },
  { key: 'technology' as const, descKey: 'technologyDesc' as const, count: 198, icon: Code2, color: '#5B8DEF', bg: 'bg-blue-50', border: 'hover:border-blue-200', apiName: 'TECHNOLOGY' },
  { key: 'coaching' as const, descKey: 'coachingDesc' as const, count: 73, icon: Sparkles, color: '#E07CCB', bg: 'bg-pink-50', border: 'hover:border-pink-200', apiName: 'COACHING' },
  { key: 'languages' as const, descKey: 'languagesDesc' as const, count: 112, icon: Globe, color: '#52C7A0', bg: 'bg-emerald-50', border: 'hover:border-emerald-200', apiName: 'LANGUAGES' },
];

export function CategoriesSection({ dict, lang }: Props) {
  return (
    <section id="categories" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-mono font-medium text-brand-500 mb-2">{dict.categories.label}</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
            {dict.categories.title}<br className="hidden sm:block" /> {dict.categories.titleBreak}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.key}
                href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                className={`group relative rounded-xl border border-ink-200/60 bg-white p-5 transition-all duration-200 ${cat.border} hover:shadow-card-hover`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`${cat.bg} w-11 h-11 rounded-xl flex items-center justify-center`}
                  >
                    <Icon size={22} style={{ color: cat.color }} strokeWidth={1.8} />
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-ink-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1"
                  />
                </div>
                <h3 className="text-sm font-bold text-ink-900 group-hover:text-ink-950 mb-1">
                  {dict.categories[cat.key]}
                </h3>
                <p className="text-xs text-ink-400 leading-relaxed mb-3">
                  {dict.categories[cat.descKey]}
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color, opacity: 0.6 }} />
                  <span className="text-[11px] font-medium text-ink-500">
                    {cat.count} {dict.categories.expertCount}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
