'use client';

import { useState } from 'react';
import {
  Sparkles,
  Check,
  ArrowRight,
  ChevronDown,
  Crown,
  Zap,
  Star,
} from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-2 border-ink-900 rounded-2xl overflow-hidden shadow-retro-sm hover:shadow-retro transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-cream-50 transition-colors"
      >
        <span className="text-base font-bold text-ink-900 pr-4">{question}</span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-ink-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm text-ink-500 leading-relaxed border-t border-ink-100 pt-4">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PricingPageContent({ dict, lang }: Props) {
  const d = dict.pricing;

  const flowSteps = [
    d.flowStep1,
    d.flowStep2,
    d.flowStep3,
    d.flowStep4,
    d.flowStep5,
  ];

  const faqs = [
    { q: d.faq1Q, a: d.faq1A },
    { q: d.faq2Q, a: d.faq2A },
    { q: d.faq3Q, a: d.faq3A },
    { q: d.faq4Q, a: d.faq4A },
    { q: d.faq5Q, a: d.faq5A },
  ];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-to-b from-[#F3EEFF] via-[#F8F5FF] to-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #7C3AED 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-brand-200/40 blur-sm animate-bee-bob" />
        <div className="absolute top-32 right-[15%] w-10 h-10 rounded-xl bg-peach-300/30 blur-sm animate-wiggle" />
        <div className="absolute bottom-16 left-[20%] w-12 h-12 rounded-full bg-emerald-200/30 blur-sm animate-bee-bob" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-ink-900 bg-white text-xs font-bold uppercase tracking-wider text-ink-600 shadow-retro-sm">
              <Sparkles size={14} className="text-brand-500" />
              {d.badge}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-ink-900 tracking-tight leading-[1.1] mb-6 animate-fade-up stagger-1">
            {d.title}{' '}
            <em className="not-italic italic text-brand-700 relative">
              {d.titleAccent}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8.5C32 3.5 72 1.5 102 4.5C132 7.5 168 9 198 5" stroke="#FFB088" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </em>
          </h1>

          <p className="text-lg sm:text-xl text-ink-500 leading-relaxed max-w-2xl mx-auto animate-fade-up stagger-2">
            {d.subtitle}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V20C240 0 480 40 720 20C960 0 1200 40 1440 20V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── PRICING CARDS ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Client (Free) */}
            <div className="relative border-2 border-ink-900 rounded-2xl p-7 shadow-retro hover:-translate-y-1 hover:shadow-retro-md transition-all duration-200 bg-gradient-to-br from-emerald-50 to-white">
              <div className="absolute -top-3 left-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 border-2 border-ink-900 text-xs font-bold text-emerald-700 shadow-retro-sm">
                  <Check size={12} />
                  {d.freeBadge}
                </span>
              </div>

              <div className="mt-4 mb-6">
                <h3 className="text-xl font-bold text-ink-900 mb-2">{d.freeTitle}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-emerald-600">{d.freePrice}</span>
                  <span className="text-sm text-ink-400">{d.freePriceLabel}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[d.freeFeature1, d.freeFeature2, d.freeFeature3, d.freeFeature4, d.freeFeature5, d.freeFeature6].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-ink-600">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={localePath(lang, '/register')}
                className="block text-center rounded-full bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 border-2 border-ink-900 shadow-retro-sm hover:shadow-retro hover:-translate-y-0.5 active:translate-y-0 active:shadow-retro-sm transition-all duration-200"
              >
                {d.freeCta}
              </a>
            </div>

            {/* Pro */}
            <div className="relative border-2 border-ink-900 rounded-2xl p-7 shadow-retro-md hover:-translate-y-1 hover:shadow-retro-lg transition-all duration-200 bg-gradient-to-br from-brand-50 to-white ring-2 ring-brand-500 ring-offset-2">
              <div className="absolute -top-3 left-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-100 border-2 border-ink-900 text-xs font-bold text-brand-700 shadow-retro-sm">
                  <Crown size={12} />
                  {d.proBadge}
                </span>
              </div>

              <div className="mt-4 mb-6">
                <h3 className="text-xl font-bold text-ink-900 mb-2">{d.proTitle}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-brand-600">{d.proPrice}</span>
                  <span className="text-sm text-ink-400">{d.proPriceLabel}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[d.proFeature1, d.proFeature2, d.proFeature3, d.proFeature4, d.proFeature5, d.proFeature6].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="text-brand-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-ink-600">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={localePath(lang, '/register')}
                className="block text-center rounded-full bg-brand-600 text-white font-bold text-sm px-6 py-3.5 border-2 border-ink-900 shadow-retro-sm hover:shadow-retro hover:-translate-y-0.5 active:translate-y-0 active:shadow-retro-sm transition-all duration-200"
              >
                {d.proCta}
              </a>
            </div>

            {/* Premium (Coming Soon) */}
            <div className="relative border-2 border-ink-900 rounded-2xl p-7 shadow-retro hover:-translate-y-1 hover:shadow-retro-md transition-all duration-200 bg-gradient-to-br from-peach-50 to-white opacity-80">
              <div className="absolute -top-3 left-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-peach-100 border-2 border-ink-900 text-xs font-bold text-peach-700 shadow-retro-sm">
                  <Star size={12} />
                  {d.comingSoonBadge}
                </span>
              </div>

              <div className="mt-4 mb-6">
                <h3 className="text-xl font-bold text-ink-900 mb-2">{d.comingSoonTitle}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-peach-600">{d.comingSoonPrice}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[d.comingSoonFeature1, d.comingSoonFeature2, d.comingSoonFeature3, d.comingSoonFeature4, d.comingSoonFeature5, d.comingSoonFeature6].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="text-peach-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-ink-500">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="block w-full text-center rounded-full bg-ink-100 text-ink-400 font-bold text-sm px-6 py-3.5 border-2 border-ink-200 cursor-not-allowed"
              >
                {d.comingSoonCta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PAYMENT FLOW ─── */}
      <section className="py-16 sm:py-24 bg-[#FAF5F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight">
              {d.flowTitle}
            </h2>
            <p className="text-lg text-ink-500 mt-4 max-w-xl mx-auto">{d.flowSubtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-0">
            {flowSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-3 sm:gap-0 sm:flex-col sm:items-center sm:text-center flex-1">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-ink-900 shadow-retro-sm flex items-center justify-center">
                    <span className="text-lg font-bold text-brand-600">{i + 1}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-ink-700 sm:mt-4 max-w-[140px]">{step}</p>
                {i < flowSteps.length - 1 && (
                  <div className="hidden sm:block absolute">
                    <ArrowRight size={16} className="text-ink-300 mt-6 ml-[140px]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Connecting arrows (desktop) */}
          <div className="hidden sm:flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-brand-500" />
              <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">{d.flowSubtitle}</span>
              <Zap size={16} className="text-brand-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
              {d.faqTitle}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 sm:py-32 bg-ink-900 overflow-hidden">
        <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full bg-[#FFB088]/20 blur-[120px]" />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 select-none pointer-events-none">
          <span className="text-[100px] sm:text-[160px] md:text-[200px] font-bold text-white/[0.03] leading-none tracking-tighter uppercase">
            BEEP.TN
          </span>
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-5 leading-[1.15]">
            {d.ctaTitle}
          </h2>
          <p className="text-lg text-ink-400 mb-10 leading-relaxed max-w-xl mx-auto">
            {d.ctaSub}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={localePath(lang, '/register')}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFB088] text-ink-900 font-bold text-base px-8 py-4 border-[2.5px] border-ink-900 shadow-retro hover:-translate-y-0.5 hover:shadow-retro-md active:translate-y-0 active:shadow-retro-sm transition-all duration-200"
            >
              {d.ctaPrimary}
              <ArrowRight size={18} />
            </a>
            <a
              href={localePath(lang, '/marketplace')}
              className="inline-flex items-center gap-2 rounded-full bg-transparent text-white font-bold text-base px-8 py-4 border-[2.5px] border-white/40 shadow-retro-white hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:border-white/60 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-200"
            >
              {d.ctaSecondary}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
