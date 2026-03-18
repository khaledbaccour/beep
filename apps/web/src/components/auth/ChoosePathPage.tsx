'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, ArrowRight, Users, Calendar, Video, Star, TrendingUp, Clock, Shield } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';
import { upgradeToExpert } from '@/lib/api';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

function BeeMascotSmall() {
  return (
    <svg width="64" height="58" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="42" rx="18" ry="12" fill="white" fillOpacity="0.6" transform="rotate(-20 30 42)" />
      <ellipse cx="90" cy="42" rx="18" ry="12" fill="white" fillOpacity="0.6" transform="rotate(20 90 42)" />
      <ellipse cx="60" cy="62" rx="32" ry="28" fill="#FBBF24" stroke="#141418" strokeWidth="3" />
      <path d="M38 52 Q60 48 82 52" stroke="#141418" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M35 64 Q60 60 85 64" stroke="#141418" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M38 76 Q60 72 82 76" stroke="#141418" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="60" cy="45" rx="22" ry="18" fill="#FBBF24" />
      <ellipse cx="50" cy="42" rx="9" ry="10" fill="white" stroke="#141418" strokeWidth="2.5" />
      <ellipse cx="70" cy="42" rx="9" ry="10" fill="white" stroke="#141418" strokeWidth="2.5" />
      <g className="animate-blink" style={{ transformOrigin: '50px 44px' }}>
        <circle cx="52" cy="44" r="5" fill="#141418" />
        <circle cx="54" cy="42" r="1.5" fill="white" />
      </g>
      <g className="animate-blink" style={{ transformOrigin: '70px 44px' }}>
        <circle cx="72" cy="44" r="5" fill="#141418" />
        <circle cx="74" cy="42" r="1.5" fill="white" />
      </g>
      <path d="M54 54 Q60 60 66 54" stroke="#141418" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="42" cy="52" rx="5" ry="3" fill="#FF9F6C" fillOpacity="0.5" />
      <ellipse cx="78" cy="52" rx="5" ry="3" fill="#FF9F6C" fillOpacity="0.5" />
      <path d="M50 28 Q46 14 38 10" stroke="#141418" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M70 28 Q74 14 82 10" stroke="#141418" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="10" r="4" fill="#FFB088" stroke="#141418" strokeWidth="2" />
      <circle cx="82" cy="10" r="4" fill="#FFB088" stroke="#141418" strokeWidth="2" />
      <path d="M60 90 L56 98 L64 98 Z" fill="#141418" />
    </svg>
  );
}

export function ChoosePathPage({ dict, lang }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<'client' | 'expert' | null>(null);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState<'client' | 'expert' | null>(null);
  const t = dict.choosePath;

  async function handleClientPath() {
    setLoading('client');
    router.push(localePath(lang, '/marketplace'));
  }

  async function handleExpertPath() {
    setLoading('expert');
    setError('');
    try {
      const res = await upgradeToExpert();
      localStorage.setItem('beep_token', res.data.accessToken);
      localStorage.setItem('beep_user', JSON.stringify(res.data.user));
      router.push(localePath(lang, '/onboarding'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#D8CCFF] py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Floating dots */}
        {[
          { top: '8%', left: '4%', size: 8, opacity: 0.1, delay: '0s' },
          { top: '15%', left: '88%', size: 10, opacity: 0.08, delay: '1s' },
          { top: '65%', left: '6%', size: 6, opacity: 0.1, delay: '2s' },
          { top: '75%', left: '82%', size: 9, opacity: 0.08, delay: '0.5s' },
          { top: '35%', left: '93%', size: 5, opacity: 0.12, delay: '1.5s' },
          { top: '55%', left: '2%', size: 7, opacity: 0.1, delay: '2.5s' },
          { top: '90%', left: '50%', size: 6, opacity: 0.08, delay: '3s' },
          { top: '5%', left: '45%', size: 5, opacity: 0.1, delay: '1.2s' },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#141418] animate-pulse"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
              animationDelay: dot.delay,
              animationDuration: '3s',
            }}
          />
        ))}

        {/* Gradient blobs */}
        <div className="absolute top-10 right-[10%] w-80 h-80 bg-brand-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-10 left-[5%] w-64 h-64 bg-peach-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-100/20 rounded-full blur-3xl" />

        {/* Decorative shapes */}
        <div className="absolute top-[12%] left-[15%] w-4 h-4 border-[2.5px] border-ink-900/10 rounded rotate-45" />
        <div className="absolute top-[25%] right-[18%] w-3 h-3 bg-peach-400/30 rounded-full" />
        <div className="absolute bottom-[20%] left-[20%] w-5 h-5 border-[2.5px] border-brand-400/20 rounded-full" />
        <div className="absolute bottom-[30%] right-[12%] w-3 h-3 border-[2.5px] border-ink-900/10 rounded rotate-12" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        {/* Logo */}
        <div className="animate-fade-up opacity-0">
          <a href={localePath(lang, '/')} className="flex items-center justify-center gap-1.5 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Beep" className="w-8 h-8" />
            <span className="text-[17px] font-body font-extrabold text-ink-900">
              beep<span className="text-brand-500">.tn</span>
            </span>
          </a>
        </div>

        {/* Bee mascot */}
        <div className="flex justify-center mb-4 animate-fade-up opacity-0" style={{ animationDelay: '0.05s' }}>
          <div className="animate-bee-bob">
            <BeeMascotSmall />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink-900 mb-3 leading-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-ink-600 max-w-md mx-auto">{t.subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl border-[2.5px] border-red-300 bg-red-50 text-sm text-red-700 text-center max-w-md mx-auto animate-fade-up">
            {error}
          </div>
        )}

        {/* Path cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
          {/* Client card */}
          <button
            onClick={handleClientPath}
            disabled={loading !== null}
            onMouseEnter={() => setHoveredCard('client')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group text-left rounded-2xl border-[2.5px] border-ink-900 bg-white p-7 sm:p-8 shadow-retro hover:-translate-y-2 hover:shadow-retro-lg active:translate-y-0 active:shadow-retro-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-70 relative overflow-hidden"
          >
            {/* Decorative corner accent */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-50 rounded-full transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl border-[2.5px] border-ink-900 bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center shadow-retro-sm mb-5 transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
                <Search size={28} className="text-white" strokeWidth={2.5} />
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mb-2">
                {t.clientTitle}
              </h2>
              <p className="text-sm text-ink-500 leading-relaxed mb-5">
                {t.clientDesc}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: Users, label: t.browseExperts },
                  { icon: Video, label: t.videoCalls },
                  { icon: Shield, label: t.securePayments },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50/80 px-3 py-1 text-[11px] font-bold text-ink-600 transition-colors duration-200 group-hover:border-brand-200 group-hover:bg-brand-50/80 group-hover:text-brand-700"
                  >
                    <Icon size={11} strokeWidth={2.5} />
                    {label}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink-900 bg-[#FFB088] px-6 py-2.5 text-sm font-black uppercase tracking-wider text-ink-900 shadow-[3px_3px_0px_0px_#141418] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#141418] group-active:translate-y-0 group-active:shadow-[1px_1px_0px_0px_#141418] transition-all duration-150">
                {loading === 'client' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
                    {t.loading}
                  </span>
                ) : (
                  <>
                    {t.clientCta}
                    <ArrowRight size={14} strokeWidth={3} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </div>
          </button>

          {/* Expert card */}
          <button
            onClick={handleExpertPath}
            disabled={loading !== null}
            onMouseEnter={() => setHoveredCard('expert')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group text-left rounded-2xl border-[2.5px] border-ink-900 bg-white p-7 sm:p-8 shadow-retro hover:-translate-y-2 hover:shadow-retro-lg active:translate-y-0 active:shadow-retro-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 focus-visible:ring-offset-2 disabled:opacity-70 relative overflow-hidden"
          >
            {/* Decorative corner accent */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-peach-50 rounded-full transition-transform duration-500 group-hover:scale-150" />

            {/* Popular badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border-[2px] border-ink-900 bg-[#FBBF24] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ink-900 shadow-[2px_2px_0px_0px_#141418] animate-shadow-pulse">
                <Star size={10} fill="#141418" />
                {t.popular}
              </span>
            </div>

            <div className="relative">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl border-[2.5px] border-ink-900 bg-gradient-to-br from-peach-400 to-peach-600 flex items-center justify-center shadow-retro-sm mb-5 transition-transform duration-300 group-hover:rotate-[4deg] group-hover:scale-105">
                <Briefcase size={28} className="text-white" strokeWidth={2.5} />
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mb-2">
                {t.expertTitle}
              </h2>
              <p className="text-sm text-ink-500 leading-relaxed mb-5">
                {t.expertDesc}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: Calendar, label: t.yourSchedule },
                  { icon: TrendingUp, label: t.growIncome },
                  { icon: Clock, label: t.quickSetup },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50/80 px-3 py-1 text-[11px] font-bold text-ink-600 transition-colors duration-200 group-hover:border-peach-200 group-hover:bg-peach-50/80 group-hover:text-peach-700"
                  >
                    <Icon size={11} strokeWidth={2.5} />
                    {label}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink-900 bg-ink-900 px-6 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_#7C3AED] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#7C3AED] group-active:translate-y-0 group-active:shadow-[1px_1px_0px_0px_#7C3AED] transition-all duration-150">
                {loading === 'expert' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.loading}
                  </span>
                ) : (
                  <>
                    {t.expertCta}
                    <ArrowRight size={14} strokeWidth={3} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </div>
          </button>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-up opacity-0" style={{ animationDelay: '0.35s' }}>
          <div className="inline-flex items-center gap-2 rounded-full border-[2px] border-ink-900/15 bg-white/50 backdrop-blur-sm px-4 py-2 shadow-[2px_2px_0px_0px_rgba(20,20,24,0.04)]">
            <div className="flex -space-x-1.5">
              {['#FF6B54', '#10B981', '#5B8DEF', '#E07CCB'].map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {['Y', 'A', 'M', 'S'][i]}
                </div>
              ))}
            </div>
            <span className="text-[11px] font-bold text-ink-600">{t.trustExperts}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-ink-900/15 bg-white/50 backdrop-blur-sm px-4 py-2 shadow-[2px_2px_0px_0px_rgba(20,20,24,0.04)]">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={11} fill="#FBBF24" stroke="#141418" strokeWidth={1} />
              ))}
            </div>
            <span className="text-[11px] font-bold text-ink-600">{t.trustRating}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-ink-900/15 bg-white/50 backdrop-blur-sm px-4 py-2 shadow-[2px_2px_0px_0px_rgba(20,20,24,0.04)]">
            <Shield size={12} className="text-emerald-500" strokeWidth={2.5} />
            <span className="text-[11px] font-bold text-ink-600">{t.trustSecure}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
