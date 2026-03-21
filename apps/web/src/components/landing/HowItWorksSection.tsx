'use client';

import { Search, CalendarDays, Video, Sparkles, ArrowRight, Zap } from 'lucide-react';
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
      cardBg: 'bg-[#E8DBFF]',
      accentColor: '#7C3AED',
      tagBg: 'bg-violet-200/70',
      tagText: 'text-violet-800',
      tagLabel: 'STEP ONE',
      decorShape: (
        <>
          {/* Floating circle */}
          <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full border-[3px] border-ink-900 bg-[#FBBF24] shadow-retro-sm" />
          {/* Dots pattern */}
          <div className="absolute bottom-4 right-4 opacity-20" style={{
            width: 80, height: 80,
            backgroundImage: 'radial-gradient(circle, #141418 2px, transparent 2px)',
            backgroundSize: '12px 12px',
          }} />
        </>
      ),
    },
    {
      number: '02',
      title: dict.howItWorks.step2Title,
      description: dict.howItWorks.step2Desc,
      icon: CalendarDays,
      iconColor: 'text-[#E87C6A]',
      iconBg: 'bg-[#FDE8E4]',
      cardBg: 'bg-[#FFE4D6]',
      accentColor: '#E87C6A',
      tagBg: 'bg-[#FFCDB2]/70',
      tagText: 'text-[#C0533E]',
      tagLabel: 'STEP TWO',
      decorShape: (
        <>
          {/* Rotated square */}
          <div className="absolute -top-2 -right-2 w-16 h-16 border-[3px] border-ink-900 bg-[#FF6B54] shadow-retro-sm rotate-12 rounded-lg" />
          {/* Zigzag line */}
          <svg className="absolute bottom-3 right-3 opacity-15" width="80" height="30" viewBox="0 0 80 30">
            <path d="M0 15 L10 5 L20 15 L30 5 L40 15 L50 5 L60 15 L70 5 L80 15" stroke="#141418" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </>
      ),
    },
    {
      number: '03',
      title: dict.howItWorks.step3Title,
      description: dict.howItWorks.step3Desc,
      icon: Video,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      cardBg: 'bg-[#B8F5D8]',
      accentColor: '#059669',
      tagBg: 'bg-emerald-200/70',
      tagText: 'text-emerald-800',
      tagLabel: 'STEP THREE',
      decorShape: (
        <>
          {/* Star burst */}
          <div className="absolute -top-3 -right-3 w-18 h-18">
            <svg width="64" height="64" viewBox="0 0 64 64" className="drop-shadow-[2px_2px_0px_#141418]">
              <polygon
                points="32,2 38,22 58,22 42,34 48,54 32,42 16,54 22,34 6,22 26,22"
                fill="#FBBF24"
                stroke="#141418"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          {/* Cross pattern */}
          <div className="absolute bottom-4 right-4 opacity-15">
            <svg width="60" height="60" viewBox="0 0 60 60">
              {[0, 20, 40].map((x) =>
                [0, 20, 40].map((y) => (
                  <g key={`${x}-${y}`}>
                    <line x1={x + 5} y1={y + 10} x2={x + 15} y2={y + 10} stroke="#141418" strokeWidth="2.5" />
                    <line x1={x + 10} y1={y + 5} x2={x + 10} y2={y + 15} stroke="#141418" strokeWidth="2.5" />
                  </g>
                ))
              )}
            </svg>
          </div>
        </>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-ink-900 overflow-hidden">
      {/* Background texture - subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Floating decorative elements */}
      <div className="absolute top-12 left-[5%] w-8 h-8 rounded-full border-2 border-white/10 animate-bee-bob" />
      <div className="absolute top-24 right-[8%] w-5 h-5 bg-[#FBBF24]/20 rotate-45 animate-wiggle" />
      <div className="absolute bottom-20 left-[12%] w-6 h-6 rounded-full bg-brand-500/15 animate-bee-bob" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-32 right-[6%] w-4 h-4 border-2 border-peach-500/20 rotate-12 animate-wiggle" style={{ animationDelay: '0.8s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-[2.5px] border-white/20 bg-white/5 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Sparkles size={14} className="text-[#FBBF24]" />
            {dict.howItWorks.label}
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-normal leading-tight">
            {dict.howItWorks.title.split(' ').map((word: string, i: number, arr: string[]) =>
              i === Math.floor(arr.length / 2) ? (
                <em key={i} className="italic text-[#FFB088] not-italic font-bold relative" style={{ fontStyle: 'italic' }}>
                  {word}{' '}
                  <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" fill="none" preserveAspectRatio="none">
                    <path d="M0 6 Q25 1 50 5 Q75 9 100 3" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </svg>
                </em>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-center text-base sm:text-lg text-ink-400 max-w-xl mx-auto mb-16 leading-relaxed">
          {dict.howItWorks.step1Desc.split('.')[0]}.
        </p>

        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-[58%] left-[20%] right-[20%] h-[3px] bg-white/[0.06] rounded-full -translate-y-1/2 z-0" />

        {/* Step Cards */}
        <div className="relative z-10 grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative"
              >
                {/* Arrow connector between cards (desktop) */}
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-5 z-20 -translate-y-1/2">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-ink-900 border-[2.5px] border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                      <ArrowRight size={16} className="text-white/60" strokeWidth={2.5} />
                    </div>
                  </div>
                )}

                {/* Main card */}
                <div
                  className={`${step.cardBg} relative border-[3px] border-ink-900 rounded-2xl p-7 sm:p-8 overflow-hidden shadow-retro-lg hover:shadow-[8px_8px_0px_0px_#141418] hover:-translate-y-2 active:shadow-retro active:translate-y-0 transition-all duration-300 cursor-default min-h-[280px] sm:min-h-[300px] flex flex-col`}
                >
                  {/* Decorative shapes */}
                  {step.decorShape}

                  {/* Tag */}
                  <div className="relative z-10 mb-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-ink-900 ${step.tagBg} text-[10px] font-bold uppercase tracking-widest ${step.tagText} shadow-[2px_2px_0px_0px_#141418]`}>
                      <Zap size={10} strokeWidth={3} />
                      {step.tagLabel}
                    </span>
                  </div>

                  {/* Step number - big watermark */}
                  <span className="absolute top-2 right-14 text-[100px] sm:text-[120px] font-bold text-ink-900/[0.06] leading-none select-none pointer-events-none z-0">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10 mb-5">
                    <div className={`w-14 h-14 rounded-xl ${step.iconBg} flex items-center justify-center border-[2.5px] border-ink-900 shadow-retro-sm group-hover:shadow-retro group-hover:-translate-y-0.5 transition-all duration-200`}>
                      <Icon size={26} className={step.iconColor} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-ink-600 leading-relaxed flex-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom accent bar */}
                  <div
                    className="relative z-10 mt-5 h-1.5 rounded-full opacity-40"
                    style={{ backgroundColor: step.accentColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative row */}
        <div className="flex items-center justify-center gap-3 mt-14">
          <div className="h-px w-12 bg-white/10" />
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#7C3AED', '#E87C6A', '#059669'][i],
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
          <div className="h-px w-12 bg-white/10" />
        </div>
      </div>
    </section>
  );
}
