'use client';

import { useState } from 'react';
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
  bgHover: string;
  apiName: string;
  startPrice: number;
  skills: string[];
  pattern: string;
}

const categories: CategoryData[] = [
  {
    key: 'fitness',
    longDescKey: 'fitnessLong',
    count: 127,
    icon: Dumbbell,
    bg: '#FFB088',
    bgHover: '#FFA070',
    apiName: 'FITNESS',
    startPrice: 25,
    skills: ['HIIT', 'Yoga', 'Nutrition', 'Weight Loss', 'Strength'],
    pattern: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(0,0,0,0.06) 0%, transparent 40%)',
  },
  {
    key: 'education',
    longDescKey: 'educationLong',
    count: 243,
    icon: BookOpen,
    bg: '#C4B5FD',
    bgHover: '#B49FFC',
    apiName: 'EDUCATION',
    startPrice: 20,
    skills: ['Math', 'Physics', 'Bac Prep', 'French', 'IELTS'],
    pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 45%), radial-gradient(circle at 80% 75%, rgba(0,0,0,0.05) 0%, transparent 35%)',
  },
  {
    key: 'design',
    longDescKey: 'designLong',
    count: 89,
    icon: Palette,
    bg: '#FDE68A',
    bgHover: '#FCDC60',
    apiName: 'DESIGN',
    startPrice: 35,
    skills: ['Branding', 'UI/UX', 'Illustration', 'Figma', 'Logo'],
    pattern: 'radial-gradient(circle at 75% 25%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(0,0,0,0.04) 0%, transparent 35%)',
  },
  {
    key: 'law',
    longDescKey: 'lawLong',
    count: 64,
    icon: Scale,
    bg: '#FFCDB2',
    bgHover: '#FFB89A',
    apiName: 'LAW',
    startPrice: 45,
    skills: ['Contracts', 'IP', 'Business Law', 'Real Estate', 'Tax'],
    pattern: 'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.14) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(0,0,0,0.06) 0%, transparent 40%)',
  },
  {
    key: 'business',
    longDescKey: 'businessLong',
    count: 156,
    icon: Briefcase,
    bg: '#93C5FD',
    bgHover: '#78B4FC',
    apiName: 'BUSINESS',
    startPrice: 30,
    skills: ['Strategy', 'Marketing', 'Startup', 'Finance', 'Growth'],
    pattern: 'radial-gradient(circle at 25% 30%, rgba(255,255,255,0.16) 0%, transparent 50%), radial-gradient(circle at 85% 70%, rgba(0,0,0,0.05) 0%, transparent 35%)',
  },
  {
    key: 'technology',
    longDescKey: 'technologyLong',
    count: 198,
    icon: Code2,
    bg: '#86EFAC',
    bgHover: '#6AE696',
    apiName: 'TECHNOLOGY',
    startPrice: 30,
    skills: ['React', 'Node.js', 'Python', 'AWS', 'AI/ML'],
    pattern: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.15) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(0,0,0,0.05) 0%, transparent 40%)',
  },
  {
    key: 'coaching',
    longDescKey: 'coachingLong',
    count: 73,
    icon: Sparkles,
    bg: '#F9A8D4',
    bgHover: '#F78DC2',
    apiName: 'COACHING',
    startPrice: 25,
    skills: ['Life Coaching', 'Mindset', 'Productivity', 'Stress', 'Goals'],
    pattern: 'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 15% 75%, rgba(0,0,0,0.04) 0%, transparent 35%)',
  },
  {
    key: 'languages',
    longDescKey: 'languagesLong',
    count: 112,
    icon: Globe,
    bg: '#A5B4FC',
    bgHover: '#8DA0FB',
    apiName: 'LANGUAGES',
    startPrice: 20,
    skills: ['English', 'French', 'Arabic', 'IELTS', 'DELF'],
    pattern: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.16) 0%, transparent 45%), radial-gradient(circle at 75% 80%, rgba(0,0,0,0.05) 0%, transparent 40%)',
  },
];

export function CategoriesPage({ dict, lang }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-cream-300 min-h-screen">
      {/* Hero Header */}
      <section className="pt-28 pb-6 sm:pt-32 sm:pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-normal text-ink-950 leading-[1.05] tracking-tight">
                {dict.categoriesPage.title}
                <br />
                <span className="font-accent text-peach-700 not-italic" style={{ fontStyle: 'italic' }}>
                  {dict.categoriesPage.titleAccent}
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-ink-500 max-w-md leading-relaxed sm:text-right sm:pb-1">
              {dict.categoriesPage.subtitle}
            </p>
          </div>
          <div className="mt-6 sm:mt-8 border-t-2 border-ink-900" />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-ink-900 rounded-3xl overflow-hidden">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              const isHovered = hoveredIndex === index;
              const isEven = index % 2 === 0;
              const isLastRow = index >= categories.length - 2;

              return (
                <a
                  key={cat.key}
                  href={`${localePath(lang, '/marketplace')}?category=${cat.apiName}`}
                  className={`group relative overflow-hidden transition-all duration-500 ease-out ${
                    isEven ? 'md:border-r-2 md:border-ink-900' : ''
                  } ${
                    !isLastRow ? 'border-b-2 border-ink-900' : ''
                  } ${
                    index < categories.length - 1 ? 'max-md:border-b-2 max-md:border-ink-900' : ''
                  }`}
                  style={{
                    backgroundColor: isHovered ? cat.bgHover : cat.bg,
                    backgroundImage: cat.pattern,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Background icon */}
                  <div
                    className="absolute -bottom-8 -right-8 transition-all duration-700 ease-out"
                    style={{
                      opacity: isHovered ? 0.12 : 0.06,
                      transform: isHovered ? 'scale(1.1) rotate(-8deg)' : 'scale(1) rotate(-5deg)',
                    }}
                  >
                    <Icon size={200} className="text-ink-950" strokeWidth={0.6} />
                  </div>

                  <div className="relative p-6 sm:p-8 min-h-[240px] sm:min-h-[280px] flex flex-col justify-between">
                    {/* Top: icon + meta */}
                    <div className="flex items-start justify-between">
                      <div
                        className="w-14 h-14 rounded-2xl border-[2.5px] border-ink-900 flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)',
                          transform: isHovered ? 'rotate(-6deg) scale(1.05)' : 'rotate(0) scale(1)',
                        }}
                      >
                        <Icon size={24} className="text-ink-900" strokeWidth={2.2} />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/40 border border-ink-900/20">
                          <Users size={12} className="text-ink-700" strokeWidth={2.5} />
                          <span className="text-xs font-bold text-ink-800">{cat.count}</span>
                        </div>
                        <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-ink-900/10 border border-ink-900/20">
                          <span className="text-xs font-bold text-ink-800">
                            {dict.categoriesPage.startFrom} {cat.startPrice}
                          </span>
                          <span className="text-[10px] text-ink-600">{dict.common.tnd}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: title + desc + skills + CTA */}
                    <div className="mt-5 flex-1 flex flex-col justify-end">
                      <h2 className="text-2xl sm:text-[28px] font-bold text-ink-950 leading-tight mb-2 tracking-tight">
                        {dict.categories[cat.key]}
                      </h2>
                      <p className="text-sm text-ink-800/70 leading-relaxed mb-4 max-w-sm">
                        {dict.categoriesPage[cat.longDescKey]}
                      </p>

                      {/* Skills pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {cat.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-ink-900/25 text-ink-800 bg-white/30 transition-colors duration-200 group-hover:bg-white/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <div
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-900 transition-all duration-300"
                          style={{
                            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                          }}
                        >
                          {dict.categoriesPage.browsePros}
                          <ArrowRight
                            size={15}
                            strokeWidth={2.5}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>

                        <div
                          className="w-10 h-10 rounded-full border-[2.5px] border-ink-900 bg-ink-900 flex items-center justify-center transition-all duration-300"
                          style={{
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(4px)',
                          }}
                        >
                          <ArrowUpRight size={16} className="text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-6 sm:px-8 bg-ink-900 border-2 border-ink-900 rounded-2xl">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-peach-500 text-ink-900 text-sm font-bold border-[2.5px] border-ink-900 shadow-retro-sm hover:-translate-y-0.5 hover:shadow-retro transition-all duration-200 retro-press"
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
