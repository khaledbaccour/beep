'use client';

import { Search, CalendarDays, Video } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Find your expert',
    description: 'Browse by category, specialty, or price. Read reviews from real clients. Every expert is verified.',
    icon: Search,
    color: 'text-brand-500',
    bg: 'bg-brand-50',
  },
  {
    number: '02',
    title: 'Pick a time & pay',
    description: 'Choose an available slot on their calendar. Pay securely — funds are held until the session completes.',
    icon: CalendarDays,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    number: '03',
    title: 'Join the video call',
    description: 'Connect face-to-face in your browser. No downloads, no subscriptions. Just click and talk.',
    icon: Video,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-mono font-medium text-brand-500 mb-2">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
            Three steps to expertise
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] border-t border-dashed border-ink-200" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${step.bg} flex items-center justify-center relative z-10`}>
                    <Icon size={20} className={step.color} strokeWidth={1.8} />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-ink-300">{step.number}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-ink-900 mb-2">{step.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
