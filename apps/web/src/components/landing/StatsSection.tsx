'use client';

const stats = [
  { value: '500+', label: 'Verified experts', sub: 'across 8 categories' },
  { value: '12K+', label: 'Sessions completed', sub: 'and counting' },
  { value: '4.9', label: 'Average rating', sub: 'from 8,000+ reviews' },
  { value: '<2min', label: 'Average booking time', sub: 'find & book instantly' },
];

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-ink-900 p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`text-center ${i > 0 ? 'md:border-l md:border-ink-700' : ''}`}>
                <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white/70">{stat.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
