'use client';

import {
  Sparkles,
  ArrowRight,
  FileText,
  Shield,
  User,
  CreditCard,
  XCircle,
  Briefcase,
  Users,
  Scale,
  AlertTriangle,
  Bell,
  Mail,
} from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function TermsPageContent({ dict, lang }: Props) {
  const d = dict.termsPage;

  const sections = [
    {
      id: 'acceptance',
      icon: FileText,
      title: d.acceptTitle,
      content: [d.acceptText],
      iconColor: 'text-brand-600',
      iconBg: 'bg-brand-100',
    },
    {
      id: 'service',
      icon: Shield,
      title: d.serviceTitle,
      content: [d.serviceText],
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100',
    },
    {
      id: 'accounts',
      icon: User,
      title: d.accountsTitle,
      content: [d.accounts1, d.accounts2, d.accounts3, d.accounts4],
      isList: true,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: d.bookingsTitle,
      content: [d.bookingsText],
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
    {
      id: 'cancellation',
      icon: XCircle,
      title: d.cancellationTitle,
      content: [d.cancel1, d.cancel2, d.cancel3, d.cancel4, d.cancel5, d.cancel6],
      isList: true,
      isHighlighted: true,
      iconColor: 'text-[#E87C6A]',
      iconBg: 'bg-[#FDE8E4]',
    },
    {
      id: 'expert-obligations',
      icon: Briefcase,
      title: d.expertTitle,
      content: [d.expert1, d.expert2, d.expert3, d.expert4],
      isList: true,
      iconColor: 'text-brand-600',
      iconBg: 'bg-brand-100',
    },
    {
      id: 'client-obligations',
      icon: Users,
      title: d.clientTitle,
      content: [d.client1, d.client2, d.client3, d.client4],
      isList: true,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100',
    },
    {
      id: 'ip',
      icon: Scale,
      title: d.ipTitle,
      content: [d.ipText],
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
    {
      id: 'liability',
      icon: AlertTriangle,
      title: d.liabilityTitle,
      content: [d.liabilityText],
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
    {
      id: 'disputes',
      icon: Scale,
      title: d.disputeTitle,
      content: [d.disputeText],
      iconColor: 'text-[#E87C6A]',
      iconBg: 'bg-[#FDE8E4]',
    },
    {
      id: 'modifications',
      icon: Bell,
      title: d.modifyTitle,
      content: [d.modifyText],
      iconColor: 'text-brand-600',
      iconBg: 'bg-brand-100',
    },
    {
      id: 'contact',
      icon: Mail,
      title: d.contactTitle,
      content: [d.contactText],
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100',
    },
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-ink-900 bg-white text-xs font-bold uppercase tracking-wider text-ink-600 shadow-retro-sm">
              <FileText size={14} className="text-brand-500" />
              {d.lastUpdated}
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
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V20C240 0 480 40 720 20C960 0 1200 40 1440 20V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── TABLE OF CONTENTS ─── */}
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="border-2 border-ink-900 rounded-2xl p-6 shadow-retro-sm bg-cream-50">
            <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider mb-4">{d.badge}</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-center gap-2 text-sm text-ink-600 hover:text-brand-600 transition-colors py-1"
                  >
                    <s.icon size={14} className={s.iconColor} />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ─── SECTIONS ─── */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          {sections.map((s) => {
            const Icon = s.icon;
            const isHighlighted = 'isHighlighted' in s && s.isHighlighted;
            return (
              <div
                key={s.id}
                id={s.id}
                className={`border-2 border-ink-900 rounded-2xl p-7 scroll-mt-28 transition-all duration-200 ${
                  isHighlighted
                    ? 'shadow-retro-md bg-gradient-to-br from-[#FFF5F2] to-white ring-2 ring-[#E87C6A]/30 ring-offset-2'
                    : 'shadow-retro-sm hover:shadow-retro'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center border-2 border-ink-900 shadow-retro-sm shrink-0`}>
                    <Icon size={18} className={s.iconColor} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-ink-900 mb-3">{s.title}</h3>
                    {s.isList ? (
                      <ul className="space-y-2">
                        {s.content.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${isHighlighted ? 'bg-[#E87C6A]' : 'bg-brand-500'}`} />
                            <span className={`text-sm ${isHighlighted ? 'text-ink-700 font-medium' : 'text-ink-600'}`}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-ink-500 leading-relaxed">{s.content[0]}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
            {d.contactTitle}
          </h2>
          <p className="text-lg text-ink-400 mb-10 leading-relaxed max-w-xl mx-auto">
            {d.contactText}
          </p>

          <a
            href={localePath(lang, '/register')}
            className="inline-flex items-center gap-2 rounded-full bg-[#FFB088] text-ink-900 font-bold text-base px-8 py-4 border-[2.5px] border-ink-900 shadow-retro hover:-translate-y-0.5 hover:shadow-retro-md active:translate-y-0 active:shadow-retro-sm transition-all duration-200"
          >
            <Sparkles size={18} />
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
