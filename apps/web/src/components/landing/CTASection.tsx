'use client';

import { ArrowRight } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function CTASection({ dict, lang }: Props) {
  return (
    <section className="relative py-24 sm:py-32 bg-ink-900 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[120px]" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full bg-[#FFB088]/20 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[150px]" />

      {/* Watermark */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 select-none pointer-events-none">
        <span className="text-[120px] sm:text-[180px] md:text-[220px] font-black text-white/[0.03] leading-none tracking-tighter uppercase">
          BEEP.TN
        </span>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Pill badge */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-black uppercase tracking-wider mb-8 border-2 border-white/20">
          Get started today
        </span>

        {/* Massive heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-tight mb-6 leading-[1.1]">
          {dict.cta.title.split(' ').slice(0, -1).join(' ')}{' '}
          <em className="not-italic text-[#FFB088] italic">
            {dict.cta.title.split(' ').slice(-1)[0]}
          </em>
        </h2>

        <p className="text-lg sm:text-xl text-ink-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          {dict.cta.subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={localePath(lang, '/register')}
            className="inline-flex items-center gap-2 rounded-full bg-[#FFB088] text-ink-900 font-black text-base px-8 py-4 border-[2.5px] border-ink-900 shadow-retro hover:-translate-y-0.5 hover:shadow-retro-md active:translate-y-0 active:shadow-retro-sm transition-all duration-200"
          >
            {dict.cta.primary}
            <ArrowRight size={18} />
          </a>
          <a
            href={localePath(lang, '/marketplace')}
            className="inline-flex items-center gap-2 rounded-full bg-transparent text-white font-black text-base px-8 py-4 border-[2.5px] border-white/40 shadow-retro-white hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:border-white/60 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-200"
          >
            {dict.cta.secondary}
          </a>
        </div>

        <p className="mt-10 text-sm text-ink-500">
          {dict.cta.finePrint}
        </p>
      </div>
    </section>
  );
}
