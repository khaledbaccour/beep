'use client';

import { Dumbbell, BookOpen, Activity, Scale, Briefcase, Code2, Heart, Globe } from 'lucide-react';

const categories = [
  { name: 'Fitness', count: 127, icon: Dumbbell, color: '#FF6B6B', bg: 'bg-red-50' },
  { name: 'Education', count: 243, icon: BookOpen, color: '#4ECDC4', bg: 'bg-teal-50' },
  { name: 'Medicine', count: 89, icon: Activity, color: '#45B7D1', bg: 'bg-sky-50' },
  { name: 'Law', count: 64, icon: Scale, color: '#DDA15E', bg: 'bg-amber-50' },
  { name: 'Business', count: 156, icon: Briefcase, color: '#7C6FE0', bg: 'bg-violet-50' },
  { name: 'Technology', count: 198, icon: Code2, color: '#5B8DEF', bg: 'bg-blue-50' },
  { name: 'Psychology', count: 73, icon: Heart, color: '#E07CCB', bg: 'bg-pink-50' },
  { name: 'Languages', count: 112, icon: Globe, color: '#52C7A0', bg: 'bg-emerald-50' },
];

export function CategoriesSection() {
  return (
    <section id="categories" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-mono font-medium text-brand-500 mb-2">Categories</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
            Every expert you need,<br className="hidden sm:block" /> in one place.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.name}
                href={`/marketplace?category=${cat.name.toUpperCase()}`}
                className="group relative rounded-lg border border-ink-200/60 bg-white p-5 transition-all duration-200 hover:border-ink-300 hover:shadow-card-hover"
              >
                <div
                  className={`${cat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
                >
                  <Icon size={20} style={{ color: cat.color }} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-ink-900 group-hover:text-ink-950">{cat.name}</h3>
                <p className="text-xs text-ink-400 mt-0.5">{cat.count} experts</p>

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
