'use client';

import { Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const experts = [
  { name: 'Yassine Bouaziz', slug: 'yassine', role: 'Fitness Coach', rating: 4.9, sessions: 340, price: 35, initials: 'YB', gradient: 'from-rose-400 to-orange-400', tags: ['Weight Loss', 'HIIT', 'Nutrition'] },
  { name: 'Amira Ben Salem', slug: 'amira', role: 'Graphic Designer', rating: 5.0, sessions: 512, price: 80, initials: 'AB', gradient: 'from-emerald-400 to-teal-400', tags: ['Branding', 'Logo Design', 'UI/UX'] },
  { name: 'Mehdi Trabelsi', slug: 'mehdi', role: 'Software Engineer', rating: 4.8, sessions: 189, price: 50, initials: 'MT', gradient: 'from-blue-400 to-cyan-400', tags: ['React', 'System Design', 'Career'] },
  { name: 'Sana Khlifi', slug: 'sana', role: 'Business Consultant', rating: 4.9, sessions: 267, price: 65, initials: 'SK', gradient: 'from-violet-400 to-purple-400', tags: ['Startup', 'Strategy', 'Marketing'] },
  { name: 'Khalil Jebali', slug: 'khalil', role: 'English Teacher', rating: 4.7, sessions: 421, price: 25, initials: 'KJ', gradient: 'from-amber-400 to-yellow-400', tags: ['IELTS', 'Business English'] },
  { name: 'Ines Maalej', slug: 'ines', role: 'Life Coach', rating: 5.0, sessions: 198, price: 70, initials: 'IM', gradient: 'from-pink-400 to-rose-400', tags: ['Productivity', 'Mindset', 'Career Change'] },
];

export function FeaturedExpertsSection({ dict, lang }: Props) {
  return (
    <section className="py-20 sm:py-28 bg-ink-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-ink-50 text-ink-500 border border-ink-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-ink-100">
                <span className="text-xs text-ink-400">{expert.sessions} {dict.featured.sessions}</span>
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
