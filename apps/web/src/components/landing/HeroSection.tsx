'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';
import { Badge } from '@/components/ui/badge';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

function BeeMascot() {
  return (
    <div className="animate-bee-bob" style={{ filter: 'drop-shadow(3px 4px 0px rgba(20,20,24,0.15))' }}>
      <svg width="120" height="110" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Wings */}
        <ellipse cx="30" cy="42" rx="18" ry="12" fill="white" fillOpacity="0.6" transform="rotate(-20 30 42)" />
        <ellipse cx="90" cy="42" rx="18" ry="12" fill="white" fillOpacity="0.6" transform="rotate(20 90 42)" />

        {/* Body */}
        <ellipse cx="60" cy="62" rx="32" ry="28" fill="#FBBF24" stroke="#141418" strokeWidth="3" />

        {/* Stripes */}
        <path d="M38 52 Q60 48 82 52" stroke="#141418" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M35 64 Q60 60 85 64" stroke="#141418" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M38 76 Q60 72 82 76" stroke="#141418" strokeWidth="5" strokeLinecap="round" fill="none" />

        {/* Face background */}
        <ellipse cx="60" cy="45" rx="22" ry="18" fill="#FBBF24" />

        {/* Eyes - white sclera */}
        <ellipse cx="50" cy="42" rx="9" ry="10" fill="white" stroke="#141418" strokeWidth="2.5" />
        <ellipse cx="70" cy="42" rx="9" ry="10" fill="white" stroke="#141418" strokeWidth="2.5" />

        {/* Pupils - big and cute */}
        <g className="animate-blink" style={{ transformOrigin: '50px 44px' }}>
          <circle cx="52" cy="44" r="5" fill="#141418" />
          <circle cx="54" cy="42" r="1.5" fill="white" />
        </g>
        <g className="animate-blink" style={{ transformOrigin: '70px 44px' }}>
          <circle cx="72" cy="44" r="5" fill="#141418" />
          <circle cx="74" cy="42" r="1.5" fill="white" />
        </g>

        {/* Happy mouth */}
        <path d="M54 54 Q60 60 66 54" stroke="#141418" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheek blush */}
        <ellipse cx="42" cy="52" rx="5" ry="3" fill="#FF9F6C" fillOpacity="0.5" />
        <ellipse cx="78" cy="52" rx="5" ry="3" fill="#FF9F6C" fillOpacity="0.5" />

        {/* Antennae */}
        <path d="M50 28 Q46 14 38 10" stroke="#141418" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M70 28 Q74 14 82 10" stroke="#141418" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="38" cy="10" r="4" fill="#FFB088" stroke="#141418" strokeWidth="2" />
        <circle cx="82" cy="10" r="4" fill="#FFB088" stroke="#141418" strokeWidth="2" />

        {/* Stinger */}
        <path d="M60 90 L56 98 L64 98 Z" fill="#141418" />
      </svg>
    </div>
  );
}

export function HeroSection({ dict, lang }: Props) {
  return (
    <section className="relative bg-[#D8CCFF] pt-32 pb-0 sm:pt-40 overflow-hidden">
      {/* Subtle floating dots for texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '15%', left: '8%', size: 6, opacity: 0.12 },
          { top: '25%', left: '85%', size: 8, opacity: 0.1 },
          { top: '60%', left: '12%', size: 5, opacity: 0.08 },
          { top: '45%', left: '92%', size: 7, opacity: 0.1 },
          { top: '70%', left: '78%', size: 4, opacity: 0.12 },
          { top: '10%', left: '50%', size: 5, opacity: 0.08 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#141418]"
            style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size, opacity: dot.opacity }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Centered content */}
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-up opacity-0 mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink-900 bg-white/60 backdrop-blur-sm px-5 py-2 text-xs font-black uppercase tracking-wider text-ink-900 shadow-retro-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              {dict.hero.badge}
            </span>
          </div>

          {/* Bee mascot peeking above the headline */}
          <div className="animate-fade-up opacity-0 stagger-1 mb-[-20px] sm:mb-[-28px] relative z-10">
            <BeeMascot />
          </div>

          {/* MASSIVE headline */}
          <h1 className="animate-fade-up opacity-0 stagger-1 text-[52px] sm:text-[76px] lg:text-[96px] font-display font-black uppercase leading-[0.9] tracking-tight text-ink-900">
            {dict.hero.headline}{' '}
            <span className="italic text-[#7C3AED] relative">
              {dict.hero.headlineAccent}
              {/* Underline scribble */}
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M2 8 Q50 2 100 7 Q150 12 198 4" stroke="#FFB088" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
            </span>
            {' '}{dict.hero.headlineSuffix}
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up opacity-0 stagger-2 mt-6 text-base sm:text-lg text-ink-600 max-w-xl leading-relaxed">
            {dict.hero.subtitle}
          </p>

          {/* CTA buttons - CHUNKY retro style */}
          <div className="animate-fade-up opacity-0 stagger-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={localePath(lang, '/register')}
              className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink-900 bg-white px-8 py-3.5 text-sm font-black uppercase tracking-wider text-ink-900 shadow-retro hover:-translate-y-0.5 hover:shadow-retro-md active:translate-y-0 active:shadow-retro-sm transition-all duration-200"
            >
              {dict.hero.ctaPrimary}
              <ArrowRight size={16} strokeWidth={3} />
            </a>
            <a
              href={localePath(lang, '/marketplace')}
              className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink-900 bg-ink-900 px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-retro-purple hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#7C3AED] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#7C3AED] transition-all duration-200"
            >
              {dict.hero.ctaSecondary}
            </a>
          </div>

          {/* Trust indicators as pills */}
          <div className="animate-fade-up opacity-0 stagger-5 mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border-[2px] border-ink-900/20 bg-white/60 backdrop-blur-sm px-4 py-2 shadow-[2px_2px_0px_0px_rgba(20,20,24,0.06)]">
              <div className="flex -space-x-1.5">
                {['#FF6B54', '#10B981', '#5B8DEF', '#E07CCB', '#DDA15E'].map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {['Y', 'A', 'M', 'S', 'K'][i]}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-ink-700">{dict.hero.trustExperts}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-ink-900/20 bg-white/60 backdrop-blur-sm px-4 py-2 shadow-[2px_2px_0px_0px_rgba(20,20,24,0.06)]">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} fill="#FBBF24" stroke="#141418" strokeWidth={1} />
                ))}
              </div>
              <span className="text-xs font-bold text-ink-700">{dict.hero.trustRating}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-ink-900/20 bg-white/60 backdrop-blur-sm px-4 py-2 shadow-[2px_2px_0px_0px_rgba(20,20,24,0.06)]">
              <CheckCircle2 size={13} className="text-emerald-500" strokeWidth={2.5} />
              <span className="text-xs font-bold text-ink-700">{dict.hero.trustFree}</span>
            </div>
          </div>
        </div>

        {/* Product preview - browser mockup with thick retro shadow */}
        <div className="animate-fade-up opacity-0 stagger-6 mt-16 lg:mt-20 pb-24">
          <div className="rounded-2xl border-[2.5px] border-ink-900 bg-white shadow-retro-xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3 bg-ink-900 border-b-[2.5px] border-ink-900">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500" />
              </div>
              <div className="flex-1 max-w-sm mx-auto">
                <div className="h-7 rounded-md bg-ink-800 flex items-center justify-center">
                  <span className="text-[11px] text-ink-300 font-mono tracking-tight">{dict.hero.mockupUrl}</span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Expert info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl border-[2.5px] border-ink-900 bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-retro-sm">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-display font-bold text-ink-900">{dict.hero.mockupName}</h3>
                        <Badge variant="success" className="text-[10px]">
                          <CheckCircle2 size={10} />
                          {dict.hero.mockupVerified}
                        </Badge>
                      </div>
                      <p className="text-sm text-ink-500 mt-0.5">{dict.hero.mockupRole} &middot; {dict.hero.mockupLocation}</p>
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">{dict.hero.mockupAvailable}</p>
                    {['Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
                      <div key={day} className="flex items-center gap-4">
                        <span className="text-xs text-ink-400 w-10 font-mono font-bold">{day}</span>
                        <div className="flex gap-2">
                          {[`${9 + i}:00`, `${10 + i}:00`, `${14 + i}:00`].map((time) => (
                            <button
                              key={time}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-ink-200 text-ink-700 bg-white hover:border-ink-900 hover:shadow-[2px_2px_0px_0px_#141418] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-150"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-ink-100" />

                {/* Booking card */}
                <div className="lg:w-64 shrink-0">
                  <div className="rounded-xl border-[2.5px] border-ink-900 p-5 shadow-retro-sm">
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">{dict.hero.mockupSession}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-display font-black text-ink-900">{dict.hero.mockupPrice}</span>
                      <span className="text-sm text-ink-400 font-bold">{dict.hero.mockupCurrency}</span>
                    </div>
                    <p className="text-xs text-ink-400">{dict.hero.mockupDuration}</p>

                    <Button variant="brand" className="w-full mt-5" size="default">
                      {dict.hero.mockupBook}
                    </Button>

                    <div className="mt-4 space-y-2">
                      {[dict.hero.mockupRefund, dict.hero.mockupEscrow, dict.hero.mockupVideo].map((text) => (
                        <div key={text} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
                          <span className="text-[11px] text-ink-400 font-medium">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wavy SVG divider - purple to white */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[60px] sm:h-[80px] lg:h-[100px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C150,100 350,0 500,60 C650,120 800,40 1000,80 C1100,100 1150,60 1200,80 L1200,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
