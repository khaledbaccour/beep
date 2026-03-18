'use client';

import { Search, CalendarDays, Video, Sparkles } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function HowItWorksSection({ dict, lang }: Props) {
  const steps = [
    {
      number: '01',
      title: dict.howItWorks.step1Title,
      description: dict.howItWorks.step1Desc,
      icon: Search,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100',
      cardBg: 'bg-violet-50',
      borderColor: 'border-ink-900',
    },
    {
      number: '02',
      title: dict.howItWorks.step2Title,
      description: dict.howItWorks.step2Desc,
      icon: CalendarDays,
      iconColor: 'text-[#E87C6A]',
      iconBg: 'bg-[#FDE8E4]',
      cardBg: 'bg-[#FFF5F2]',
      borderColor: 'border-ink-900',
    },
    {
      number: '03',
      title: dict.howItWorks.step3Title,
      description: dict.howItWorks.step3Desc,
      icon: Video,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      cardBg: 'bg-emerald-50',
      borderColor: 'border-ink-900',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider text-white/70">
            <Sparkles size={14} className="text-[#E8A87C]" />
            {dict.howItWorks.label}
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-normal leading-tight">
            {dict.howItWorks.title.split(' ').map((word: string, i: number, arr: string[]) =>
              i === Math.floor(arr.length / 2) ? (
                <em key={i} className="italic text-[#E8A87C] not-italic font-bold" style={{ fontStyle: 'italic' }}>
                  {word}{' '}
                </em>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h2>
        </div>

        {/* Step Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`${step.cardBg} border-2 ${step.borderColor} rounded-2xl p-8 relative overflow-hidden shadow-retro hover:shadow-retro-md hover:-translate-y-1 active:shadow-retro-sm active:translate-y-0 transition-all duration-200`}
              >
                {/* Step number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-5xl font-bold text-ink-900/10">
                    {step.number}
                  </span>
                  <div className={`w-12 h-12 rounded-full ${step.iconBg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm`}>
                    <Icon size={22} className={step.iconColor} strokeWidth={2} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-ink-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
