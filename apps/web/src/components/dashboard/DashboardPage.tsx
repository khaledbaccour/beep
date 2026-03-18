'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Copy, Check, ExternalLink, ArrowRight, X } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';
import type { UserProfile, Tab } from './types';
import { OverviewTab } from './OverviewTab';
import { ProfileTab } from './ProfileTab';
import { AvailabilityTab } from './AvailabilityTab';
import { BookingsTab } from './BookingsTab';
import { ClientDashboard } from './ClientDashboard';
import { revertToClient, getOnboardingStatus } from '@/lib/api';
import type { ExpertProfile } from '@/lib/api';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

const TAB_ICONS: Record<Tab, string> = {
  overview: '📊',
  profile: '✏️',
  availability: '🗓️',
  bookings: '📋',
};

function getGreeting(d: Dictionary['dashboard']): string {
  const h = new Date().getHours();
  if (h < 12) return d.greetingMorning;
  if (h < 18) return d.greetingAfternoon;
  return d.greetingEvening;
}

export function DashboardPage({ dict, lang }: Props) {
  const d = dict.dashboard;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [slugCopied, setSlugCopied] = useState(false);
  const [onboardingBannerDismissed, setOnboardingBannerDismissed] = useState(false);
  const [hasDraftProfile, setHasDraftProfile] = useState(false);
  const [draftStep, setDraftStep] = useState(0);
  const [revertingToClient, setRevertingToClient] = useState(false);
  const [revertError, setRevertError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('beep_user');
    if (!stored) {
      router.push(localePath(lang, '/login'));
      return;
    }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    const storedProfile = localStorage.getItem('beep_expert_profile');
    if (storedProfile) {
      try { setExpertProfile(JSON.parse(storedProfile)); } catch { /* ignore */ }
    }

    // Check for draft onboarding profile (CLIENT users who started but didn't finish)
    if (parsedUser.role === 'CLIENT' || (parsedUser.role === 'EXPERT' && parsedUser.onboardingCompleted === false)) {
      getOnboardingStatus()
        .then((res) => {
          if (res.data && !res.data.completed && res.data.currentStep > 0) {
            setHasDraftProfile(true);
            setDraftStep(res.data.currentStep);
          }
        })
        .catch(() => { /* No draft */ });
    }
  }, [lang, router]);

  if (!user) return null;

  const isExpertWithOnboarding = user.role === 'EXPERT' && user.onboardingCompleted !== false;
  const isIncompleteExpert = user.role === 'EXPERT' && user.onboardingCompleted === false;
  const hasOnboardingDraft = hasDraftProfile || isIncompleteExpert;
  const isExpert = isExpertWithOnboarding;
  const expertTabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: d.overview },
    { key: 'profile', label: d.profile },
    { key: 'availability', label: d.availability },
    { key: 'bookings', label: d.bookings },
  ];

  const greeting = getGreeting(d);
  const profileUrl = expertProfile ? `beep.tn/${expertProfile.slug}` : null;

  function copySlug() {
    if (!profileUrl) return;
    navigator.clipboard.writeText(`https://${profileUrl}`);
    setSlugCopied(true);
    setTimeout(() => setSlugCopied(false), 2000);
  }

  async function handleRevertToClient() {
    setRevertingToClient(true);
    setRevertError('');
    try {
      const res = await revertToClient();
      localStorage.setItem('beep_token', res.data.accessToken);
      localStorage.setItem('beep_user', JSON.stringify(res.data.user));
      setUser(res.data.user as unknown as UserProfile);
      setHasDraftProfile(false);
      setOnboardingBannerDismissed(true);
    } catch (err) {
      setRevertError(err instanceof Error ? err.message : 'Failed to revert. Please try again.');
    } finally {
      setRevertingToClient(false);
    }
  }

  return (
    <section className="pt-24 pb-20 min-h-screen bg-cream-50/30">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-brand-100/30 rounded-full blur-3xl" />
        <div className="absolute top-40 left-[5%] w-48 h-48 bg-peach-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Hero greeting card */}
        <div
          className="relative mb-8 rounded-2xl border-[2.5px] border-ink-900 bg-white overflow-hidden shadow-retro-md animate-fade-up"
        >
          {/* Colored top accent strip */}
          <div className="h-2 bg-gradient-to-r from-peach-500 via-brand-400 to-peach-400" />

          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-xl border-[2.5px] border-ink-900 bg-gradient-to-br from-peach-400 to-brand-400 flex items-center justify-center shadow-retro-sm">
                    <span className="text-xl font-display font-bold text-white">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-success-500 flex items-center justify-center">
                    <Sparkles size={10} className="text-white" />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-ink-400 font-medium">{greeting} 👋</p>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 -mt-0.5">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-xs text-ink-400 mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Expert badge + link */}
              {isExpert && (
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-brand-100 text-brand-700 border-2 border-brand-300">
                    {d.proDashboard}
                  </span>
                  {profileUrl && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={copySlug}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-ink-600 bg-cream-100 border-2 border-ink-200 rounded-lg hover:border-ink-400 transition-all group"
                      >
                        {slugCopied ? <Check size={12} className="text-success-600" /> : <Copy size={12} />}
                        <span className="font-mono">{profileUrl}</span>
                      </button>
                      <a
                        href={localePath(lang, `/${expertProfile!.slug}`)}
                        className="p-1.5 rounded-lg border-2 border-ink-200 text-ink-400 hover:text-ink-900 hover:border-ink-400 transition-all"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {!isExpert && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-peach-100 text-peach-700 border-2 border-peach-300">
                  {d.myAccount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Incomplete onboarding banner (draft or incomplete expert) */}
        {hasOnboardingDraft && !onboardingBannerDismissed && (
          <div className="mb-8 rounded-2xl border-[2.5px] border-ink-900 bg-gradient-to-r from-brand-50 via-white to-peach-50 overflow-hidden shadow-retro animate-fade-up" style={{ animationDelay: '80ms' }}>
            <div className="px-6 py-5 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-100 text-amber-700 border border-amber-300">
                      {d.onboardingPending ?? 'Setup pending'}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-bold text-ink-900 mb-1">
                    {d.completeYourProfile ?? 'Complete your expert profile'}
                  </h3>
                  <p className="text-sm text-ink-500 mb-4">
                    {d.completeYourProfileDesc ?? 'Finish setting up your profile to start receiving bookings. You can browse as a client in the meantime.'}
                    {draftStep > 0 && (
                      <span className="block mt-1 text-xs text-ink-400 font-semibold">
                        {d.draftProgress ?? 'Progress saved'} ({draftStep}/4)
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={localePath(lang, '/onboarding')}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-black rounded-full bg-ink-900 text-white border-[2.5px] border-ink-900 shadow-[3px_3px_0px_0px_#7C3AED] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#7C3AED] active:translate-y-0 active:shadow-[1px_1px_0px_0px_#7C3AED] transition-all duration-150"
                    >
                      {d.continueOnboarding ?? 'Continue setup'}
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </a>
                    <button
                      onClick={handleRevertToClient}
                      disabled={revertingToClient}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full text-ink-500 border-2 border-ink-200 hover:border-ink-300 hover:text-ink-700 transition-all"
                    >
                      {revertingToClient
                        ? (d.loading ?? 'Loading...')
                        : (d.abandonDraft ?? d.stayAsClient ?? 'Abandon draft')}
                    </button>
                  </div>
                  {revertError && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{revertError}</p>
                  )}
                </div>
                <button
                  onClick={() => setOnboardingBannerDismissed(true)}
                  className="p-1.5 rounded-lg text-ink-300 hover:text-ink-600 hover:bg-ink-100 transition-all shrink-0"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab navigation for experts */}
        {isExpert && (
          <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1 scrollbar-none animate-fade-up" style={{ animationDelay: '80ms' }}>
            {expertTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap border-[2.5px] transition-all duration-200 ${
                  tab === t.key
                    ? 'bg-ink-900 text-white border-ink-900 shadow-retro-sm -translate-y-0.5'
                    : 'bg-white text-ink-500 border-ink-900 hover:bg-ink-50 hover:-translate-y-0.5 hover:shadow-retro-sm'
                }`}
              >
                <span className="text-base">{TAB_ICONS[t.key]}</span>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab content */}
        <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
          {isExpert ? (
            <>
              {tab === 'overview' && <OverviewTab d={d} lang={lang} />}
              {tab === 'profile' && <ProfileTab d={d} lang={lang} />}
              {tab === 'availability' && <AvailabilityTab d={d} lang={lang} />}
              {tab === 'bookings' && <BookingsTab d={d} lang={lang} isExpert />}
            </>
          ) : (
            <ClientDashboard d={d} lang={lang} />
          )}
        </div>
      </div>
    </section>
  );
}
