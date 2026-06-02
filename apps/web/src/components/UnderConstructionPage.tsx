'use client';

import type { Locale } from '@/i18n';

// NOTE: This placeholder intentionally keeps the legacy "beep.tn" brand.
// It is shown only on the Tunisian domain (beep.tn) while the live product
// runs on kliik.click. Do NOT rebrand this file to kliik.
const content: Record<Locale, { heading: string; subtitle: string; note: string }> = {
  en: {
    heading: 'Under Construction',
    subtitle: "We're building something amazing.",
    note: 'Stay tuned!',
  },
  hi: {
    heading: 'निर्माणाधीन',
    subtitle: 'हम कुछ शानदार बना रहे हैं।',
    note: 'जुड़े रहिए!',
  },
};

export function UnderConstructionPage({ lang }: { lang: Locale }) {
  const t = content[lang] ?? content.en;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 px-6 text-center">
      {/* Logo — legacy beep.tn brand (Tunisian placeholder only) */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="beep" className="w-10 h-10" />
          <span className="font-display font-bold text-2xl text-ink-900 tracking-tight">
            beep<span className="text-brand-500">.tn</span>
          </span>
        </div>
      </div>

      {/* Animated bee */}
      <div className="text-5xl mb-6 animate-bee-bob" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="32" cy="36" rx="16" ry="14" fill="#FFB088" stroke="#141418" strokeWidth="2.5" />
          <rect x="20" y="30" width="24" height="4" rx="2" fill="#141418" opacity="0.7" />
          <rect x="20" y="38" width="24" height="4" rx="2" fill="#141418" opacity="0.7" />
          <circle cx="26" cy="32" r="2.5" fill="#141418" />
          <circle cx="38" cy="32" r="2.5" fill="#141418" />
          <circle cx="27" cy="31" r="1" fill="white" />
          <circle cx="39" cy="31" r="1" fill="white" />
          <path d="M29 40 Q32 43 35 40" stroke="#141418" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <ellipse cx="22" cy="24" rx="8" ry="5" fill="#DDD0FF" stroke="#141418" strokeWidth="1.5" transform="rotate(-20 22 24)" opacity="0.8" />
          <ellipse cx="42" cy="24" rx="8" ry="5" fill="#DDD0FF" stroke="#141418" strokeWidth="1.5" transform="rotate(20 42 24)" opacity="0.8" />
        </svg>
      </div>

      {/* Heading */}
      <div className="bg-white border-2 border-ink-900 rounded-2xl shadow-retro-lg px-8 py-10 max-w-md w-full">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-900 mb-4">
          {t.heading}
        </h1>
        <p className="font-body text-ink-500 text-lg mb-2">
          {t.subtitle}
        </p>
        <p className="font-body text-brand-600 font-semibold text-lg">
          {t.note}
        </p>
      </div>

      {/* Decorative dots */}
      <div className="mt-10 flex gap-2">
        <span className="w-3 h-3 rounded-full bg-brand-400 animate-pulse" />
        <span className="w-3 h-3 rounded-full bg-peach-500 animate-pulse [animation-delay:200ms]" />
        <span className="w-3 h-3 rounded-full bg-brand-400 animate-pulse [animation-delay:400ms]" />
      </div>
    </div>
  );
}
