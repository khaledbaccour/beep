'use client';

import {
  Dumbbell,
  BookOpen,
  Palette,
  Scale,
  Briefcase,
  Code2,
  Sparkles,
  Globe,
  ArrowUpRight,
  ArrowRight,
  Users,
  Star,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

interface CategoryData {
  key: 'fitness' | 'education' | 'design' | 'law' | 'business' | 'technology' | 'coaching' | 'languages';
  longDescKey: 'fitnessLong' | 'educationLong' | 'designLong' | 'lawLong' | 'businessLong' | 'technologyLong' | 'coachingLong' | 'languagesLong';
  count: number;
  icon: LucideIcon;
  bg: string;
  apiName: string;
  startPrice: number;
  skills: string[];
}

const categories: CategoryData[] = [
  {
    key: 'fitness',
    longDescKey: 'fitnessLong',
    count: 127,
    icon: Dumbbell,
    bg: '#FFB088',
    apiName: 'FITNESS',
    startPrice: 25,
    skills: ['HIIT', 'Yoga', 'Nutrition', 'Weight Loss', 'Strength'],
  },
  {
    key: 'education',
    longDescKey: 'educationLong',
    count: 243,
    icon: BookOpen,
    bg: '#C4B5FD',
    apiName: 'EDUCATION',
    startPrice: 20,
    skills: ['Math', 'Physics', 'Bac Prep', 'French', 'IELTS'],
  },
  {
    key: 'design',
    longDescKey: 'designLong',
    count: 89,
    icon: Palette,
    bg: '#FDE68A',
    apiName: 'DESIGN',
    startPrice: 35,
    skills: ['Branding', 'UI/UX', 'Illustration', 'Figma', 'Logo'],
  },
  {
    key: 'law',
    longDescKey: 'lawLong',
    count: 64,
    icon: Scale,
    bg: '#FFCDB2',
    apiName: 'LAW',
    startPrice: 45,
    skills: ['Contracts', 'IP', 'Business Law', 'Real Estate', 'Tax'],
  },
  {
    key: 'business',
    longDescKey: 'businessLong',
    count: 156,
    icon: Briefcase,
    bg: '#93C5FD',
    apiName: 'BUSINESS',
    startPrice: 30,
    skills: ['Strategy', 'Marketing', 'Startup', 'Finance', 'Growth'],
  },
  {
    key: 'technology',
    longDescKey: 'technologyLong',
    count: 198,
    icon: Code2,
    bg: '#86EFAC',
    apiName: 'TECHNOLOGY',
    startPrice: 30,
    skills: ['React', 'Node.js', 'Python', 'AWS', 'AI/ML'],
  },
  {
    key: 'coaching',
    longDescKey: 'coachingLong',
    count: 73,
    icon: Sparkles,
    bg: '#F9A8D4',
    apiName: 'COACHING',
    startPrice: 25,
    skills: ['Life Coaching', 'Mindset', 'Productivity', 'Stress', 'Goals'],
  },
  {
    key: 'languages',
    longDescKey: 'languagesLong',
    count: 112,
    icon: Globe,
    bg: '#A5B4FC',
    apiName: 'LANGUAGES',
    startPrice: 20,
    skills: ['English', 'French', 'Arabic', 'IELTS', 'DELF'],
  },
];

export function CategoriesPage({ dict, lang }: Props) {
  const [first, second, ...rest] = categories;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF5F0' }}>
      {/* Hero Header */}
      <section className="pt-28 pb-8 sm:pt-36 sm:pb-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up opacity-0 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#141418] text-xs font-bold uppercase tracking-wider text-[#141418]">
              <LayoutGrid size={14} strokeWidth={2.5} />
              {dict.categoriesPage.title}
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up opacity-0 stagger-1 text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink-950 leading-[1.1] tracking-tight">
            {dict.categoriesPage.title}
            <br />
            <span className="font-accent text-peach-700" style={{ fontStyle: 'italic' }}>
              {dict.categoriesPage.titleAccent}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up opacity-0 stagger-2 mt-5 text-base sm:text-lg text-ink-500 max-w-xl mx-auto leading-relaxed">
            {dict.categoriesPage.subtitle}
          </p>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Two featured categories -- span 2 cols each on large */}
            {[first, second].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.key}
                  href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                  className={`animate-fade-up opacity-0 stagger-${i + 3} group relative lg:col-span-2 rounded-2xl border-2 border-[#141418] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#141418]`}
                  style={{ backgroundColor: cat.bg }}
                >
                  {/* Decorative oversized icon */}
                  <div className="absolute -bottom-8 -right-8 opacity-[0.08] transition-all duration-500 group-hover:opacity-[0.14] group-hover:scale-110 group-hover:-rotate-6">
                    <Icon size={200} className="text-[#141418]" strokeWidth={0.7} />
                  </div>

                  <div className="relative p-7 sm:p-8 flex flex-col justify-between min-h-[260px] sm:min-h-[280px]">
                    {/* Top: icon + meta */}
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl border-[2.5px] border-[#141418] bg-white/40 flex items-center justify-center transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-105 group-hover:bg-white/60">
                        <Icon size={26} className="text-[#141418]" strokeWidth={2} />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#141418] bg-white/50 text-xs font-bold text-[#141418]">
                          <Users size={12} strokeWidth={2.5} />
                          {cat.count} {dict.categories.expertCount}
                        </div>
                        <div className="flex items-center gap-0.5 px-3 py-1.5 rounded-full bg-[#141418]/10 border border-[#141418]/20 text-xs font-bold text-[#141418]">
                          {dict.categoriesPage.startFrom} {cat.startPrice}
                          <span className="text-[10px] text-[#141418]/60 ml-0.5">{dict.common.tnd}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: title + desc + skills + CTA */}
                    <div className="mt-6 flex-1 flex flex-col justify-end">
                      <h2 className="text-2xl sm:text-[28px] font-bold text-[#141418] leading-tight mb-2 tracking-tight">
                        {dict.categories[cat.key]}
                      </h2>
                      <p className="text-sm text-[#141418]/65 leading-relaxed mb-4 max-w-sm">
                        {dict.categoriesPage[cat.longDescKey]}
                      </p>

                      {/* Skills pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {cat.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-[#141418]/25 text-[#141418]/80 bg-white/30 transition-colors duration-200 group-hover:bg-white/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* CTA row */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#141418] transition-transform duration-300 group-hover:translate-x-1">
                          {dict.categoriesPage.browsePros}
                          <ArrowRight size={15} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>

                        {/* Hover arrow button */}
                        <div className="w-10 h-10 rounded-full border-[2.5px] border-[#141418] bg-[#141418] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                          <ArrowUpRight size={16} className="text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}

            {/* Remaining 6 categories -- compact cards */}
            {rest.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.key}
                  href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                  className={`animate-fade-up opacity-0 stagger-${Math.min(i + 5, 8)} group relative rounded-2xl border-2 border-[#141418] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#141418]`}
                  style={{ backgroundColor: cat.bg }}
                >
                  {/* Subtle oversized icon */}
                  <div className="absolute -bottom-4 -right-4 opacity-[0.08] transition-all duration-500 group-hover:opacity-[0.14] group-hover:scale-110">
                    <Icon size={110} className="text-[#141418]" strokeWidth={0.8} />
                  </div>

                  <div className="relative p-5 sm:p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
                    {/* Top: icon + count */}
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl border-2 border-[#141418] bg-white/40 flex items-center justify-center transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-105 group-hover:bg-white/60">
                        <Icon size={20} className="text-[#141418]" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1 text-xs font-bold text-[#141418]/70">
                          <Users size={11} strokeWidth={2.5} />
                          {cat.count}
                        </span>
                        <span className="text-[10px] font-bold text-[#141418]/50">
                          {dict.categoriesPage.startFrom} {cat.startPrice} {dict.common.tnd}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: title + desc */}
                    <div className="mt-auto">
                      <h3 className="text-base sm:text-lg font-bold text-[#141418] mb-1 tracking-tight">
                        {dict.categories[cat.key]}
                      </h3>
                      <p className="text-xs text-[#141418]/60 leading-relaxed line-clamp-2 mb-3">
                        {dict.categoriesPage[cat.longDescKey]}
                      </p>

                      {/* Skills pills - show top 3 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {cat.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 text-[10px] font-semibold rounded-full border border-[#141418]/20 text-[#141418]/70 bg-white/30 transition-colors duration-200 group-hover:bg-white/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#141418]/80 transition-transform duration-300 group-hover:translate-x-1 inline-flex items-center gap-1">
                          {dict.categoriesPage.browsePros}
                          <ArrowRight size={12} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute top-5 right-5 w-8 h-8 rounded-full border-2 border-[#141418] bg-[#141418] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
                    <ArrowUpRight size={13} className="text-white" strokeWidth={2.5} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-up opacity-0 flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-6 sm:px-8 bg-ink-900 border-2 border-[#141418] rounded-2xl shadow-retro">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#FFB088', '#C4B5FD', '#86EFAC', '#93C5FD'].map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-ink-900"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{dict.categoriesPage.allCategories}</p>
                <div className="flex items-center gap-1 text-ink-400 text-xs">
                  <Star size={10} fill="currentColor" />
                  <span>4.9/5</span>
                  <span className="mx-1">&middot;</span>
                  <span>1,062 {dict.categories.expertCount}</span>
                </div>
              </div>
            </div>

            <a
              href={localePath(lang, '/marketplace')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-peach-500 text-ink-900 text-sm font-bold uppercase tracking-wide border-[2.5px] border-[#141418] shadow-retro-sm hover:-translate-y-0.5 hover:shadow-retro transition-all duration-200 retro-press"
            >
              {dict.categoriesPage.allCategoriesCta}
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
