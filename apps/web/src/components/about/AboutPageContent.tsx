'use client';

import {
  Sparkles,
  ArrowRight,
  Eye,
  BadgeCheck,
  Scale,
  Zap,
  Target,
  Telescope,
} from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function AboutPageContent({ dict, lang }: Props) {
  const d = dict.about;

  const values = [
    { title: d.value1Title, desc: d.value1Desc, icon: Eye, bg: 'bg-violet-50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
    { title: d.value2Title, desc: d.value2Desc, icon: BadgeCheck, bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { title: d.value3Title, desc: d.value3Desc, icon: Scale, bg: 'bg-[#FFF5F2]', iconBg: 'bg-[#FDE8E4]', iconColor: 'text-[#E87C6A]' },
    { title: d.value4Title, desc: d.value4Desc, icon: Zap, bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  ];

  const stats = [
    { value: d.statsExperts, label: d.statsExpertsLabel, color: 'text-brand-600' },
    { value: d.statsSessions, label: d.statsSessionsLabel, color: 'text-emerald-600' },
    { value: d.statsRating, label: d.statsRatingLabel, color: 'text-[#E87C6A]' },
    { value: d.statsCategories, label: d.statsCategoriesLabel, color: 'text-amber-600' },
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
            </em>{' '}
            {d.titleSuffix}
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

      {/* ─── MISSION & VISION ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="border-2 border-ink-900 rounded-2xl p-8 sm:p-10 shadow-retro-md bg-gradient-to-br from-brand-50 to-white hover:-translate-y-1 hover:shadow-retro-lg transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center border-2 border-ink-900 shadow-retro-sm mb-6">
                <Target size={26} className="text-brand-600" strokeWidth={2} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">{d.missionLabel}</span>
              <h3 className="text-2xl font-bold text-ink-900 mb-4">{d.missionTitle}</h3>
              <p className="text-base text-ink-500 leading-relaxed">{d.missionDesc}</p>
            </div>

            {/* Vision */}
            <div className="border-2 border-ink-900 rounded-2xl p-8 sm:p-10 shadow-retro-md bg-gradient-to-br from-[#FFF5F2] to-white hover:-translate-y-1 hover:shadow-retro-lg transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-[#FDE8E4] flex items-center justify-center border-2 border-ink-900 shadow-retro-sm mb-6">
                <Telescope size={26} className="text-[#E87C6A]" strokeWidth={2} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E87C6A] mb-2 block">{d.visionTitle}</span>
              <h3 className="text-2xl font-bold text-ink-900 mb-4">{d.visionTitle}</h3>
              <p className="text-base text-ink-500 leading-relaxed">{d.visionDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-16 sm:py-24 bg-[#FAF5F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight">
              {d.valuesTitle}
            </h2>
            <p className="text-lg text-ink-500 mt-4 max-w-xl mx-auto">{d.valuesSub}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className={`${v.bg} border-2 border-ink-900 rounded-2xl p-7 shadow-retro hover:shadow-retro-md hover:-translate-y-1 active:shadow-retro-sm active:translate-y-0 transition-all duration-200`}
                >
                  <div className={`w-12 h-12 rounded-full ${v.iconBg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm mb-5`}>
                    <Icon size={22} className={v.iconColor} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-ink-900 bg-white text-xs font-bold uppercase tracking-wider text-ink-600 shadow-retro-sm mb-6">
              <Sparkles size={14} className="text-brand-500" />
              {d.storyLabel}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight">
              {d.storyTitle}
            </h2>
          </div>

          <div className="space-y-6">
            {[d.storyP1, d.storyP2, d.storyP3].map((p, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 sm:p-8 border-2 border-ink-900 shadow-retro-sm ${
                  i % 2 === 0 ? 'bg-cream-50' : 'bg-brand-50'
                }`}
              >
                <p className="text-base sm:text-lg text-ink-700 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 sm:py-24 bg-[#FAF5F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border-2 border-ink-900 rounded-2xl p-7 shadow-retro text-center hover:-translate-y-1 hover:shadow-retro-md transition-all duration-200">
                <span className={`text-4xl sm:text-5xl font-bold ${s.color} block mb-2`}>{s.value}</span>
                <span className="text-sm text-ink-500 font-medium">{s.label}</span>
              </div>
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
