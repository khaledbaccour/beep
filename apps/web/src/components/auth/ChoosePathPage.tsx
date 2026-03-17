'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, ArrowRight } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';
import { upgradeToExpert } from '@/lib/api';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function ChoosePathPage({ dict, lang }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<'client' | 'expert' | null>(null);
  const [error, setError] = useState('');
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
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#D8CCFF] py-16 px-4 relative overflow-hidden">
      {/* Decorative background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[
          { top: '10%', left: '5%', size: 6, opacity: 0.1 },
          { top: '20%', left: '90%', size: 8, opacity: 0.08 },
          { top: '70%', left: '8%', size: 5, opacity: 0.1 },
          { top: '80%', left: '85%', size: 7, opacity: 0.08 },
          { top: '40%', left: '95%', size: 4, opacity: 0.12 },
          { top: '60%', left: '3%', size: 6, opacity: 0.1 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#141418]"
            style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size, opacity: dot.opacity }}
          />
        ))}

        <div className="absolute top-20 right-[15%] w-64 h-64 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[10%] w-48 h-48 bg-peach-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-3xl mx-auto">
        {/* Logo */}
        <a href={localePath(lang, '/')} className="flex items-center justify-center gap-1.5 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Beep" className="w-8 h-8" />
          <span className="text-[17px] font-body font-extrabold text-ink-900">
            beep<span className="text-brand-500">.tn</span>
          </span>
        </a>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 mb-2">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-ink-600">{t.subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Path cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Client card */}
          <button
            onClick={handleClientPath}
            disabled={loading !== null}
            className="group text-left rounded-2xl border-[2.5px] border-ink-900 bg-white p-6 sm:p-8 shadow-retro hover:-translate-y-1 hover:shadow-retro-md active:translate-y-0 active:shadow-retro-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl border-[2.5px] border-ink-900 bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center shadow-retro-sm mb-5">
              <Search size={24} className="text-white" strokeWidth={2.5} />
            </div>

            <h2 className="text-xl font-display font-bold text-ink-900 mb-2">
              {t.clientTitle}
            </h2>
            <p className="text-sm text-ink-500 leading-relaxed mb-6">
              {t.clientDesc}
            </p>

            <span className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink-900 bg-[#FFB088] px-5 py-2.5 text-sm font-black uppercase tracking-wider text-ink-900 shadow-[3px_3px_0px_0px_#141418] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#141418] group-active:translate-y-0 group-active:shadow-[1px_1px_0px_0px_#141418] transition-all duration-150">
              {loading === 'client' ? '...' : t.clientCta}
              <ArrowRight size={14} strokeWidth={3} />
            </span>
          </button>

          {/* Expert card */}
          <button
            onClick={handleExpertPath}
            disabled={loading !== null}
            className="group text-left rounded-2xl border-[2.5px] border-ink-900 bg-white p-6 sm:p-8 shadow-retro hover:-translate-y-1 hover:shadow-retro-md active:translate-y-0 active:shadow-retro-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl border-[2.5px] border-ink-900 bg-gradient-to-br from-peach-400 to-peach-600 flex items-center justify-center shadow-retro-sm mb-5">
              <Briefcase size={24} className="text-white" strokeWidth={2.5} />
            </div>

            <h2 className="text-xl font-display font-bold text-ink-900 mb-2">
              {t.expertTitle}
            </h2>
            <p className="text-sm text-ink-500 leading-relaxed mb-6">
              {t.expertDesc}
            </p>

            <span className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink-900 bg-ink-900 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_#7C3AED] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#7C3AED] group-active:translate-y-0 group-active:shadow-[1px_1px_0px_0px_#7C3AED] transition-all duration-150">
              {loading === 'expert' ? '...' : t.expertCta}
              <ArrowRight size={14} strokeWidth={3} />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
