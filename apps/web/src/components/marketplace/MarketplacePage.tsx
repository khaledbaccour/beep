'use client';

import { useState } from 'react';
import { Search, Star, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const categoryKeys = ['all', 'fitness', 'education', 'medicine', 'law', 'business', 'technology', 'psychology', 'languages'] as const;

const experts = [
  { name: 'Yassine Bouaziz', slug: 'yassine', role: 'Fitness Coach', price: 35, rating: 4.9, sessions: 340, initials: 'YB', gradient: 'from-rose-400 to-orange-400', tags: ['Weight Loss', 'HIIT'] },
  { name: 'Dr. Amira Ben Salem', slug: 'dr-amira', role: 'Dermatologist', price: 80, rating: 5.0, sessions: 512, initials: 'AB', gradient: 'from-emerald-400 to-teal-400', tags: ['Skincare', 'Acne'] },
  { name: 'Mehdi Trabelsi', slug: 'mehdi', role: 'Software Engineer', price: 50, rating: 4.8, sessions: 189, initials: 'MT', gradient: 'from-blue-400 to-cyan-400', tags: ['React', 'System Design'] },
  { name: 'Sana Khlifi', slug: 'sana', role: 'Business Consultant', price: 65, rating: 4.9, sessions: 267, initials: 'SK', gradient: 'from-violet-400 to-purple-400', tags: ['Startup', 'Strategy'] },
  { name: 'Khalil Jebali', slug: 'khalil', role: 'English Teacher', price: 25, rating: 4.7, sessions: 421, initials: 'KJ', gradient: 'from-amber-400 to-yellow-400', tags: ['IELTS', 'Speaking'] },
  { name: 'Dr. Ines Maalej', slug: 'dr-ines', role: 'Psychologist', price: 70, rating: 5.0, sessions: 198, initials: 'IM', gradient: 'from-pink-400 to-rose-400', tags: ['Anxiety', 'CBT'] },
  { name: 'Omar Chakroun', slug: 'omar', role: 'Lawyer', price: 90, rating: 4.8, sessions: 145, initials: 'OC', gradient: 'from-amber-500 to-orange-500', tags: ['Business Law', 'Contracts'] },
  { name: 'Leila Hamdi', slug: 'leila', role: 'Nutritionist', price: 40, rating: 4.9, sessions: 278, initials: 'LH', gradient: 'from-green-400 to-emerald-400', tags: ['Diet Plans', 'Sports'] },
  { name: 'Nabil Sfar', slug: 'nabil', role: 'Math Tutor', price: 20, rating: 4.6, sessions: 567, initials: 'NS', gradient: 'from-blue-500 to-indigo-500', tags: ['Calculus', 'Bac Prep'] },
];

export function MarketplacePage({ dict, lang }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');

  const getCategoryLabel = (key: string): string => {
    if (key === 'all') return dict.marketplace.all;
    const catKey = key as keyof typeof dict.categories;
    return dict.categories[catKey] as string;
  };

  return (
    <section className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-ink-900 tracking-tight mb-1">
            {dict.marketplace.title}
          </h1>
          <p className="text-ink-500 text-sm">{dict.marketplace.subtitle}</p>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <Input
              type="text"
              placeholder={dict.marketplace.searchPlaceholder}
              className="pl-10 h-10"
            />
          </div>
          <Button variant="outline" size="default" className="gap-2 shrink-0">
            <SlidersHorizontal size={14} />
            {dict.marketplace.filters}
          </Button>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1 scrollbar-none">
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border transition-all ${
                activeCategory === key
                  ? 'bg-ink-900 text-white border-ink-900'
                  : 'bg-white text-ink-500 border-ink-200 hover:border-ink-300 hover:text-ink-700'
              }`}
            >
              {getCategoryLabel(key)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {experts.map((expert) => (
            <a
              key={expert.slug}
              href={localePath(lang, `/${expert.slug}`)}
              className="group rounded-xl border border-ink-200/60 bg-white p-5 transition-all duration-200 hover:shadow-card-hover hover:border-ink-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${expert.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                    {expert.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-500 transition-colors">
                      {expert.name}
                    </h3>
                    <p className="text-xs text-ink-400">{expert.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  <Star size={10} fill="#F59E0B" stroke="none" />
                  {expert.rating}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {expert.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-ink-50 text-ink-500 border border-ink-100">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-ink-100">
                <span className="text-xs text-ink-400">{expert.sessions} {dict.marketplace.sessions}</span>
                <span className="text-base font-bold text-ink-900">
                  {expert.price} <span className="text-xs font-normal text-ink-400">{dict.common.tnd}</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
