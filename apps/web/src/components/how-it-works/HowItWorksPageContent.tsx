'use client';

import { useState } from 'react';
import {
  Search,
  CalendarDays,
  Video,
  ShieldCheck,
  Wallet,
  BadgeCheck,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
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

export function HowItWorksPageContent({ dict, lang }: Props) {
  const d = dict.howItWorksPage;

  const steps = [
    {
      number: d.step1Number,
      title: d.step1Title,
      desc: d.step1Desc,
      details: [d.step1Detail1, d.step1Detail2, d.step1Detail3],
      icon: Search,
      gradient: 'from-violet-100 to-violet-50',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      numberColor: 'text-violet-200',
      accentBorder: 'border-violet-300',
      dotColor: 'bg-violet-500',
    },
    {
      number: d.step2Number,
      title: d.step2Title,
      desc: d.step2Desc,
      details: [d.step2Detail1, d.step2Detail2, d.step2Detail3],
      icon: CalendarDays,
      gradient: 'from-[#FDE8E4] to-[#FFF5F2]',
      iconBg: 'bg-[#FDE8E4]',
      iconColor: 'text-[#E87C6A]',
      numberColor: 'text-[#FBCFC7]',
      accentBorder: 'border-[#F5B8AD]',
      dotColor: 'bg-[#E87C6A]',
    },
    {
      number: d.step3Number,
      title: d.step3Title,
      desc: d.step3Desc,
      details: [d.step3Detail1, d.step3Detail2, d.step3Detail3],
      icon: Video,
      gradient: 'from-emerald-100 to-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      numberColor: 'text-emerald-200',
      accentBorder: 'border-emerald-300',
      dotColor: 'bg-emerald-500',
    },
  ];

  const guarantees = [
    {
      title: d.guarantee1Title,
      desc: d.guarantee1Desc,
      icon: ShieldCheck,
      bg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100',
    },
    {
      title: d.guarantee2Title,
      desc: d.guarantee2Desc,
      icon: Wallet,
      bg: 'bg-[#FFF5F2]',
      iconColor: 'text-[#E87C6A]',
      iconBg: 'bg-[#FDE8E4]',
    },
    {
      title: d.guarantee3Title,
      desc: d.guarantee3Desc,
      icon: BadgeCheck,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
  ];

  const faqs = [
    { q: d.faq1Q, a: d.faq1A },
    { q: d.faq2Q, a: d.faq2A },
    { q: d.faq3Q, a: d.faq3A },
    { q: d.faq4Q, a: d.faq4A },
    { q: d.faq5Q, a: d.faq5A },
    { q: d.faq6Q, a: d.faq6A },
  ];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-to-b from-[#F3EEFF] via-[#F8F5FF] to-white overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #7C3AED 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Floating shapes */}
        <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-brand-200/40 blur-sm animate-bee-bob" />
        <div className="absolute top-32 right-[15%] w-10 h-10 rounded-xl bg-peach-300/30 blur-sm animate-wiggle" />
        <div className="absolute bottom-16 left-[20%] w-12 h-12 rounded-full bg-emerald-200/30 blur-sm animate-bee-bob" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-ink-900 bg-white text-xs font-bold uppercase tracking-wider text-ink-600 shadow-retro-sm">
              <Sparkles size={14} className="text-brand-500" />
              {d.badge}
            </span>
          </div>

          {/* Heading */}
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

        {/* Wavy divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V20C240 0 480 40 720 20C960 0 1200 40 1440 20V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── STEPS ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-12 sm:space-y-20">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isReversed = i % 2 === 1;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16`}
                >
                  {/* Visual card */}
                  <div className="w-full lg:w-1/2">
                    <div className={`relative bg-gradient-to-br ${step.gradient} border-2 border-ink-900 rounded-3xl p-8 sm:p-10 shadow-retro-md overflow-hidden`}>
                      {/* Large step number watermark */}
                      <span className={`absolute top-4 right-6 text-[120px] sm:text-[160px] font-bold ${step.numberColor} leading-none select-none pointer-events-none`}>
                        {step.number}
                      </span>

                      <div className="relative">
                        <div className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm mb-6`}>
                          <Icon size={26} className={step.iconColor} strokeWidth={2} />
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-4">
                          {step.title}
                        </h3>

                        <p className="text-base text-ink-500 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    {step.details.map((detail, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-3 p-4 rounded-xl bg-cream-50 border border-cream-700/20 hover:border-cream-700/40 transition-colors"
                      >
                        <CheckCircle2 size={20} className={`${step.iconColor} shrink-0 mt-0.5`} />
                        <span className="text-sm sm:text-base text-ink-700 leading-relaxed">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connecting line (desktop only) */}
          <div className="hidden lg:flex justify-center -mt-4 mb-0">
            <div className="flex items-center gap-2 mt-12">
              <Zap size={18} className="text-brand-500" />
              <span className="text-sm font-bold text-ink-400 uppercase tracking-wider">
                {d.badge}
              </span>
              <Zap size={18} className="text-brand-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── GUARANTEES ─── */}
      <section className="py-16 sm:py-24 bg-[#FAF5F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-ink-900 bg-white text-xs font-bold uppercase tracking-wider text-ink-600 shadow-retro-sm mb-6">
              <ShieldCheck size={14} className="text-emerald-600" />
              {d.guaranteeTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight">
              {d.guaranteeTitle}
            </h2>
            <p className="text-lg text-ink-500 mt-4 max-w-xl mx-auto">
              {d.guaranteeSub}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {guarantees.map((g) => {
              const GIcon = g.icon;
              return (
                <div
                  key={g.title}
                  className={`${g.bg} border-2 border-ink-900 rounded-2xl p-7 shadow-retro hover:shadow-retro-md hover:-translate-y-1 active:shadow-retro-sm active:translate-y-0 transition-all duration-200`}
                >
                  <div className={`w-12 h-12 rounded-full ${g.iconBg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm mb-5`}>
                    <GIcon size={22} className={g.iconColor} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2">{g.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{g.desc}</p>
                </div>
              );
            })}
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
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 sm:py-32 bg-ink-900 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full bg-[#FFB088]/20 blur-[120px]" />

        {/* Watermark */}
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
