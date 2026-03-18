'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

interface StoredUser {
  id: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'EXPERT' | 'ADMIN';
  avatarUrl: string | null;
  onboardingCompleted?: boolean;
}

export function Navbar({ dict, lang }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const router = useRouter();

  const navLinks = [
    { label: dict.nav.experts, href: localePath(lang, '/marketplace') },
    { label: dict.nav.howItWorks, href: '#how-it-works' },
    { label: dict.nav.categories, href: '#categories' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('beep_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored) as StoredUser);
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('beep_token');
    localStorage.removeItem('beep_user');
    setUser(null);
    router.push(localePath(lang, '/'));
  };

  const pathname = usePathname();
  const pathWithoutLang = pathname.replace(/^\/(fr|en|ar)/, '') || '/';

  const dashboardHref = localePath(lang, '/dashboard');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={`max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14 bg-white border-[2.5px] border-ink-900 rounded-full transition-all duration-300 ${
          scrolled ? 'shadow-retro-sm' : 'shadow-none'
        }`}
      >
        {/* Logo */}
        <a href={localePath(lang, '/')} className="flex items-center gap-1.5 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Beep" className="w-8 h-8" />
          <span className="text-[17px] font-body font-bold text-ink-900">
            beep<span className="text-brand-500">.tn</span>
          </span>
        </a>

        {/* Desktop nav links — centered */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center border-2 border-ink-900 rounded-full overflow-hidden mr-1">
            {(['fr', 'en', 'ar'] as const).map((locale) => (
              <a
                key={locale}
                href={locale === 'fr' ? pathWithoutLang : `/${locale}${pathWithoutLang}`}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  lang === locale
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
                }`}
              >
                {dict.langSwitcher[locale]}
              </a>
            ))}
          </div>

          {user ? (
            <>
              <a
                href={dashboardHref}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold rounded-full bg-[#FFB088] text-ink-900 border-[2.5px] border-ink-900 shadow-[3px_3px_0px_0px_#141418] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#141418] active:translate-y-0 active:shadow-[1px_1px_0px_0px_#141418] transition-all duration-150"
              >
                <LayoutDashboard size={14} strokeWidth={2.5} />
                {dict.nav.dashboard}
              </a>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
              >
                {dict.nav.logout}
              </button>
            </>
          ) : (
            <>
              <a
                href={localePath(lang, '/login')}
                className="px-3 py-1.5 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
              >
                {dict.nav.login}
              </a>

              <a
                href={localePath(lang, '/register')}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold rounded-full bg-[#FFB088] text-ink-900 border-[2.5px] border-ink-900 shadow-[3px_3px_0px_0px_#141418] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#141418] active:translate-y-0 active:shadow-[1px_1px_0px_0px_#141418] transition-all duration-150"
              >
                {dict.nav.getStarted}
                <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-ink-600 hover:text-ink-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-5xl bg-white border-[2.5px] border-ink-900 rounded-2xl shadow-retro overflow-hidden">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm text-ink-600 hover:text-ink-900 hover:bg-ink-50 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-1 px-3 py-2">
              {(['fr', 'en', 'ar'] as const).map((locale) => (
                <a
                  key={locale}
                  href={locale === 'fr' ? pathWithoutLang : `/${locale}${pathWithoutLang}`}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    lang === locale
                      ? 'bg-ink-900 text-white border-ink-900'
                      : 'text-ink-500 border-ink-200 hover:border-ink-300'
                  }`}
                >
                  {dict.langSwitcher[locale]}
                </a>
              ))}
            </div>

            <div className="pt-3 mt-2 border-t border-ink-100 flex flex-col gap-2">
              {user ? (
                <>
                  <a
                    href={dashboardHref}
                    className="w-full text-center inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full bg-[#FFB088] text-ink-900 border-[2.5px] border-ink-900 shadow-[3px_3px_0px_0px_#141418] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#141418] active:translate-y-0 active:shadow-[1px_1px_0px_0px_#141418] transition-all duration-150"
                  >
                    <LayoutDashboard size={14} strokeWidth={2.5} />
                    {dict.nav.dashboard}
                  </a>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 border border-ink-200 rounded-full transition-colors"
                  >
                    {dict.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <a
                    href={localePath(lang, '/login')}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 border border-ink-200 rounded-full transition-colors"
                  >
                    {dict.nav.login}
                  </a>
                  <a
                    href={localePath(lang, '/register')}
                    className="w-full text-center inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full bg-[#FFB088] text-ink-900 border-[2.5px] border-ink-900 shadow-[3px_3px_0px_0px_#141418] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#141418] active:translate-y-0 active:shadow-[1px_1px_0px_0px_#141418] transition-all duration-150"
                  >
                    {dict.nav.getStarted}
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
