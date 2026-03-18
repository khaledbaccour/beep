'use client';

import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  DollarSign,
  Zap,
  Star,
  TrendingUp,
  Clock,
  Banknote,
  CheckCircle2,
} from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function EarningsPageContent({ dict, lang }: Props) {
  const d = dict.earningsPage;

  const [sessions, setSessions] = useState(8);
  const [price, setPrice] = useState(80);

  const monthlyEarnings = Math.round(sessions * price * 0.85 * 4);

  const modelSteps = [
    { title: d.modelStep1, desc: d.modelStep1Desc, icon: DollarSign, color: 'text-brand-600', bg: 'bg-brand-100', gradient: 'from-brand-50 to-white' },
    { title: d.modelStep2, desc: d.modelStep2Desc, icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-100', gradient: 'from-emerald-50 to-white' },
    { title: d.modelStep3, desc: d.modelStep3Desc, icon: Zap, color: 'text-[#E87C6A]', bg: 'bg-[#FDE8E4]', gradient: 'from-[#FFF5F2] to-white' },
    { title: d.modelStep4, desc: d.modelStep4Desc, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100', gradient: 'from-amber-50 to-white' },
  ];

  const payoutSteps = [
    { title: d.payout1Title, desc: d.payout1Desc, step: '1', color: 'text-brand-600', bg: 'bg-brand-100' },
    { title: d.payout2Title, desc: d.payout2Desc, step: '2', color: 'text-[#E87C6A]', bg: 'bg-[#FDE8E4]' },
    { title: d.payout3Title, desc: d.payout3Desc, step: '3', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const tips = [
    { title: d.tip1Title, desc: d.tip1Desc, icon: UserCheck, bg: 'bg-brand-50', iconBg: 'bg-brand-100', iconColor: 'text-brand-600' },
    { title: d.tip2Title, desc: d.tip2Desc, icon: DollarSign, bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { title: d.tip3Title, desc: d.tip3Desc, icon: Zap, bg: 'bg-[#FFF5F2]', iconBg: 'bg-[#FDE8E4]', iconColor: 'text-[#E87C6A]' },
    { title: d.tip4Title, desc: d.tip4Desc, icon: Star, bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  ];

  const stats = [
    { value: d.stat1Value, label: d.stat1Label, color: 'text-brand-600' },
    { value: d.stat2Value, label: d.stat2Label, color: 'text-emerald-600' },
    { value: d.stat3Value, label: d.stat3Label, color: 'text-[#E87C6A]' },
    { value: d.stat4Value, label: d.stat4Label, color: 'text-amber-600' },
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
        <div className="absolute top-40 right-[8%] w-8 h-8 rounded-full bg-amber-200/40 blur-sm animate-bee-bob" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-ink-900 bg-white text-xs font-bold uppercase tracking-wider text-ink-600 shadow-retro-sm">
              <TrendingUp size={14} className="text-brand-500" />
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

      {/* ─── EARNING MODEL ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight">
              {d.modelTitle}
            </h2>
            <p className="text-lg text-ink-500 mt-4 max-w-xl mx-auto">{d.modelSub}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modelSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  <div className={`bg-gradient-to-br ${step.gradient} border-2 border-ink-900 rounded-2xl p-7 shadow-retro hover:-translate-y-1 hover:shadow-retro-md transition-all duration-200 h-full`}>
                    {/* Step number watermark */}
                    <span className="absolute top-3 right-4 text-6xl font-bold text-ink-100 leading-none select-none pointer-events-none">
                      {i + 1}
                    </span>
                    <div className={`w-12 h-12 rounded-full ${step.bg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm mb-5`}>
                      <Icon size={22} className={step.color} strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold text-ink-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-ink-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {/* Connector arrow (desktop, not last) */}
                  {i < modelSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <ArrowRight size={16} className="text-ink-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CALCULATOR ─── */}
      <section className="py-16 sm:py-24 bg-[#FAF5F0]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-ink-900 bg-white text-xs font-bold uppercase tracking-wider text-ink-600 shadow-retro-sm mb-6">
              <Sparkles size={14} className="text-brand-500" />
              {d.calcTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
              {d.calcSubtitle}
            </h2>
          </div>

          <div className="border-2 border-ink-900 rounded-2xl p-8 sm:p-10 shadow-retro-md bg-white">
            {/* Sessions slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-ink-700">{d.calcSessions}</label>
                <span className="text-lg font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">{sessions}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={sessions}
                onChange={(e) => setSessions(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-ink-100 accent-brand-600"
              />
              <div className="flex justify-between text-xs text-ink-400 mt-1">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            {/* Price slider */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-ink-700">{d.calcPrice}</label>
                <span className="text-lg font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">{price} TND</span>
              </div>
              <input
                type="range"
                min={30}
                max={300}
                step={10}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-ink-100 accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-ink-400 mt-1">
                <span>30 TND</span>
                <span>300 TND</span>
              </div>
            </div>

            {/* Result */}
            <div className="bg-gradient-to-br from-brand-50 via-white to-emerald-50 border-2 border-ink-900 rounded-2xl p-8 text-center shadow-retro-sm">
              <p className="text-sm font-bold text-ink-500 uppercase tracking-wider mb-2">{d.calcResult}</p>
              <p className="text-5xl sm:text-6xl font-bold text-brand-600 mb-2">
                {monthlyEarnings.toLocaleString()} <span className="text-2xl">TND</span>
              </p>
              <p className="text-xs text-ink-400">{d.calcFormula}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PAYOUT TIMELINE ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight">
              {d.payoutTitle}
            </h2>
            <p className="text-lg text-ink-500 mt-4 max-w-xl mx-auto">{d.payoutSub}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {payoutSteps.map((s) => (
              <div key={s.title} className="border-2 border-ink-900 rounded-2xl p-7 shadow-retro hover:-translate-y-1 hover:shadow-retro-md transition-all duration-200 bg-white relative overflow-hidden">
                <span className="absolute top-3 right-4 text-7xl font-bold text-ink-50 leading-none select-none pointer-events-none">
                  {s.step}
                </span>
                <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm mb-5`}>
                  <Clock size={18} className={s.color} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-2">{s.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIPS ─── */}
      <section className="py-16 sm:py-24 bg-[#FAF5F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight">
              {d.tipsTitle}
            </h2>
            <p className="text-lg text-ink-500 mt-4 max-w-xl mx-auto">{d.tipsSub}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className={`${tip.bg} border-2 border-ink-900 rounded-2xl p-7 shadow-retro hover:shadow-retro-md hover:-translate-y-1 active:shadow-retro-sm active:translate-y-0 transition-all duration-200`}
                >
                  <div className={`w-12 h-12 rounded-full ${tip.iconBg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm mb-5`}>
                    <Icon size={22} className={tip.iconColor} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
              {d.statsTitle}
            </h2>
          </div>

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
              href={localePath(lang, '/how-it-works')}
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
