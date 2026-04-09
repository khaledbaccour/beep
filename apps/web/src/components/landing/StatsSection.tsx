'use client';

import { BarChart3, Star, Zap, TrendingUp, Clock } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const cardStyles = [
  {
    bg: 'bg-[#E8DBFF]',
    valueTxt: 'text-brand-700',
    icon: Star,
    iconBg: 'bg-[#FBBF24]',
    decorBg: '#7C3AED',
    decorShape: (
      <>
        {/* Floating circle top-right */}
        <div className="absolute -top-2.5 -right-2.5 w-14 h-14 rounded-full border-[3px] border-ink-900 bg-[#FBBF24] shadow-retro-sm opacity-80" />
        {/* Dots pattern bottom-left */}
        <div className="absolute bottom-3 left-3 opacity-15" style={{
          width: 56, height: 56,
          backgroundImage: 'radial-gradient(circle, #141418 2px, transparent 2px)',
          backgroundSize: '10px 10px',
        }} />
      </>
    ),
  },
  {
    bg: 'bg-[#FFE4D6]',
    valueTxt: 'text-[#D4553A]',
    icon: Zap,
    iconBg: 'bg-[#FF6B54]',
    decorBg: '#E87C6A',
    decorShape: (
      <>
        {/* Rotated square */}
        <div className="absolute -top-2 -right-2 w-12 h-12 border-[3px] border-ink-900 bg-[#FBBF24] shadow-retro-sm rotate-12 rounded-md" />
        {/* Zigzag */}
        <svg className="absolute bottom-3 left-3 opacity-15" width="60" height="24" viewBox="0 0 60 24">
          <path d="M0 12 L8 4 L16 12 L24 4 L32 12 L40 4 L48 12 L56 4 L60 8" stroke="#141418" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </>
    ),
  },
  {
    bg: 'bg-[#B8F5D8]',
    valueTxt: 'text-emerald-700',
    icon: TrendingUp,
    iconBg: 'bg-[#34D399]',
    decorBg: '#059669',
    decorShape: (
      <>
        {/* Star burst */}
        <div className="absolute -top-2.5 -right-2.5">
          <svg width="48" height="48" viewBox="0 0 48 48" className="drop-shadow-[2px_2px_0px_#141418]">
            <polygon
              points="24,2 28,16 44,16 32,26 36,40 24,32 12,40 16,26 4,16 20,16"
              fill="#FBBF24"
              stroke="#141418"
              strokeWidth="2.5"
            />
          </svg>
        </div>
        {/* Cross-hatch */}
        <div className="absolute bottom-3 left-3 opacity-10" style={{
          width: 56, height: 56,
          backgroundImage: `
            linear-gradient(45deg, #141418 1px, transparent 1px),
            linear-gradient(-45deg, #141418 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }} />
      </>
    ),
  },
  {
    bg: 'bg-[#FEF3C7]',
    valueTxt: 'text-blue-700',
    icon: Clock,
    iconBg: 'bg-[#60A5FA]',
    decorBg: '#2563EB',
    decorShape: (
      <>
        {/* Floating pill */}
        <div className="absolute -top-2 -right-2 w-16 h-8 rounded-full border-[3px] border-ink-900 bg-[#FF6B54] shadow-retro-sm" />
        {/* Dots pattern */}
        <div className="absolute bottom-3 left-3 opacity-15" style={{
          width: 56, height: 56,
          backgroundImage: 'radial-gradient(circle, #141418 2px, transparent 2px)',
          backgroundSize: '12px 12px',
        }} />
      </>
    ),
  },
];

export function StatsSection({ dict, lang }: Props) {
  const stats = [
    { value: dict.stats.experts, label: dict.stats.expertsLabel, sub: dict.stats.expertsSub },
    { value: dict.stats.sessions, label: dict.stats.sessionsLabel, sub: dict.stats.sessionsSub },
    { value: dict.stats.rating, label: dict.stats.ratingLabel, sub: dict.stats.ratingSub },
    { value: dict.stats.booking, label: dict.stats.bookingLabel, sub: dict.stats.bookingSub },
  ];

  return (
    <section className="relative py-20 sm:py-28 bg-cream-300 overflow-hidden">
      {/* Background dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #141418 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating decorative shapes */}
      <div className="absolute top-12 left-[8%] w-16 h-16 rounded-full border-[3px] border-ink-900 bg-[#FBBF24] opacity-20 animate-bee-bob" />
      <div className="absolute top-24 right-[6%] w-10 h-10 border-[3px] border-ink-900 bg-brand-600 opacity-15 rotate-45 rounded-sm animate-wiggle" />
      <div className="absolute bottom-16 left-[12%] w-12 h-12 border-[3px] border-ink-900 bg-peach-500 opacity-15 rounded-lg rotate-12 animate-bee-bob" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 right-[10%] w-8 h-8 rounded-full border-[3px] border-ink-900 bg-emerald-400 opacity-15 animate-wiggle" style={{ animationDelay: '0.5s' }} />

      {/* Decorative zigzag top */}
      <svg className="absolute top-6 left-1/2 -translate-x-1/2 opacity-[0.06] pointer-events-none" width="400" height="20" viewBox="0 0 400 20">
        <path d="M0 10 L15 2 L30 10 L45 2 L60 10 L75 2 L90 10 L105 2 L120 10 L135 2 L150 10 L165 2 L180 10 L195 2 L210 10 L225 2 L240 10 L255 2 L270 10 L285 2 L300 10 L315 2 L330 10 L345 2 L360 10 L375 2 L390 10 L400 5" stroke="#141418" strokeWidth="3" fill="none" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-[2.5px] border-ink-900 bg-white text-xs font-bold uppercase tracking-wider text-ink-900 shadow-retro-sm">
            <BarChart3 size={14} className="text-[#E87C6A]" />
            {dict.stats.badge}
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-normal leading-tight">
            {dict.stats.title}{' '}
            <em className="italic text-[#E87C6A] relative">
              {dict.stats.titleAccent}
              {/* Underline scribble */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 opacity-60" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0 8 Q50 0 100 8 Q150 14 200 6" stroke="#E87C6A" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </em>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-center text-ink-500 text-base sm:text-lg max-w-2xl mx-auto mb-14 font-body">
          {dict.stats.expertsSub && dict.stats.sessionsSub
            ? `${dict.stats.expertsSub} \u2022 ${dict.stats.sessionsSub}`
            : '\u00A0'}
        </p>

        {/* Stats cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((stat, i) => {
            const style = cardStyles[i];
            const Icon = style.icon;
            return (
              <div
                key={stat.label}
                className={`
                  relative group rounded-2xl border-[2.5px] border-ink-900 ${style.bg}
                  p-6 sm:p-7 shadow-retro transition-all duration-200 ease-out
                  hover:shadow-retro-lg hover:-translate-x-[2px] hover:-translate-y-[2px]
                  overflow-hidden
                `}
              >
                {/* Decorative shapes */}
                {style.decorShape}

                {/* Icon badge */}
                <div className={`relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-xl border-[2.5px] border-ink-900 ${style.iconBg} shadow-retro-sm mb-5`}>
                  <Icon size={20} className="text-ink-900" strokeWidth={2.5} />
                </div>

                {/* Value */}
                <div className={`relative z-10 text-4xl sm:text-5xl font-bold ${style.valueTxt} mb-2 tracking-tight`}>
                  {stat.value}
                </div>

                {/* Label */}
                <div className="relative z-10 text-base font-bold text-ink-900 leading-snug">
                  {stat.label}
                </div>

                {/* Sub text */}
                <div className="relative z-10 text-sm text-ink-600 mt-1.5 leading-snug">
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
