'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function Navbar({ dict, lang }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const pathname = usePathname();
  const pathWithoutLang = pathname.replace(/^\/(fr|en|ar)/, '') || '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'h-16 bg-white/95 backdrop-blur-md border-b border-ink-100'
          : 'h-16 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href={localePath(lang, '/')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-ink-900 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm tracking-tight">b</span>
          </div>
          <span className="text-[17px] font-display font-bold text-ink-900">
            beep<span className="text-brand-500">.tn</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-ink-500 hover:text-ink-900 transition-colors rounded-md"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center border border-ink-200 rounded-md overflow-hidden mr-1">
            {(['fr', 'en', 'ar'] as const).map((locale) => (
              <a
                key={locale}
                href={locale === 'fr' ? pathWithoutLang : `/${locale}${pathWithoutLang}`}
                className={`px-2 py-1 text-[11px] font-medium transition-colors ${
                  lang === locale
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
                }`}
              >
                {dict.langSwitcher[locale]}
              </a>
            ))}
          </div>

          <Button variant="ghost" size="sm" asChild>
            <a href={localePath(lang, '/login')}>{dict.nav.login}</a>
          </Button>
          <Button variant="brand" size="sm" asChild>
            <a href={localePath(lang, '/register')}>{dict.nav.getStarted}</a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-ink-600 hover:text-ink-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-ink-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm text-ink-600 hover:text-ink-900 hover:bg-ink-50 rounded-md transition-colors"
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
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
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
              <Button variant="outline" size="sm" asChild className="w-full justify-center">
                <a href={localePath(lang, '/login')}>{dict.nav.login}</a>
              </Button>
              <Button variant="brand" size="sm" asChild className="w-full justify-center">
                <a href={localePath(lang, '/register')}>{dict.nav.getStarted}</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
