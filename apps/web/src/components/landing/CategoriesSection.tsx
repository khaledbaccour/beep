'use client';

import { Dumbbell, BookOpen, Activity, Scale, Briefcase, Code2, Heart, Globe } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const categories = [
  { key: 'fitness' as const, count: 127, icon: Dumbbell, color: '#FF6B6B', bg: 'bg-red-50', apiName: 'FITNESS' },
  { key: 'education' as const, count: 243, icon: BookOpen, color: '#4ECDC4', bg: 'bg-teal-50', apiName: 'EDUCATION' },
  { key: 'medicine' as const, count: 89, icon: Activity, color: '#45B7D1', bg: 'bg-sky-50', apiName: 'MEDICINE' },
  { key: 'law' as const, count: 64, icon: Scale, color: '#DDA15E', bg: 'bg-amber-50', apiName: 'LAW' },
  { key: 'business' as const, count: 156, icon: Briefcase, color: '#7C6FE0', bg: 'bg-violet-50', apiName: 'BUSINESS' },
  { key: 'technology' as const, count: 198, icon: Code2, color: '#5B8DEF', bg: 'bg-blue-50', apiName: 'TECHNOLOGY' },
  { key: 'psychology' as const, count: 73, icon: Heart, color: '#E07CCB', bg: 'bg-pink-50', apiName: 'PSYCHOLOGY' },
  { key: 'languages' as const, count: 112, icon: Globe, color: '#52C7A0', bg: 'bg-emerald-50', apiName: 'LANGUAGES' },
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.key}
                href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                className="group relative rounded-lg border border-ink-200/60 bg-white p-5 transition-all duration-200 hover:border-ink-300 hover:shadow-card-hover"
              >
                <div
                  className={`${cat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
                >
                  <Icon size={20} style={{ color: cat.color }} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-ink-900 group-hover:text-ink-950">{dict.categories[cat.key]}</h3>
                <p className="text-xs text-ink-400 mt-0.5">{cat.count} {dict.categories.expertCount}</p>

                <svg
                  className="absolute top-5 right-4 text-ink-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
