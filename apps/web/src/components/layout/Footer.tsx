'use client';

import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function Footer({ dict, lang }: Props) {
  const footerLinks = [
    {
      title: dict.footer.platform,
      links: [
        { label: dict.footer.marketplace, href: localePath(lang, '/marketplace') },
        { label: dict.footer.categoriesLink, href: localePath(lang, '/categories') },
        { label: dict.footer.howItWorksLink, href: localePath(lang, '/how-it-works') },
        { label: dict.footer.pricing, href: '#' },
      ],
    },
    {
      title: dict.footer.forExperts,
      links: [
        { label: dict.footer.becomeExpert, href: localePath(lang, '/register') + '?role=expert' },
        { label: dict.footer.dashboard, href: '#' },
        { label: dict.footer.earnings, href: '#' },
        { label: dict.footer.support, href: '#' },
      ],
    },
    {
      title: dict.footer.company,
      links: [
        { label: dict.footer.about, href: '#' },
        { label: dict.footer.privacy, href: '#' },
        { label: dict.footer.terms, href: '#' },
        { label: dict.footer.contact, href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-ink-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-10">
        {/* Top section: brand + link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-1.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Beep" className="w-9 h-9" />
              <span className="text-lg font-body font-bold text-white">
                beep<span className="text-brand-400">.tn</span>
              </span>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed max-w-[280px] mb-6">
              {dict.footer.description}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {/* X / Twitter */}
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-ink-700 flex items-center justify-center text-ink-400 hover:text-white hover:border-ink-500 transition-colors"
                aria-label="Twitter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-ink-700 flex items-center justify-center text-ink-400 hover:text-white hover:border-ink-500 transition-colors"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-ink-700 flex items-center justify-center text-ink-400 hover:text-white hover:border-ink-500 transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-12 border-t border-ink-700 gap-4">
          <p className="text-xs text-ink-500">
            &copy; {new Date().getFullYear()} {dict.footer.copyright}
          </p>
          <div className="flex items-center gap-5 text-xs text-ink-500">
            <a href="#" className="hover:text-white transition-colors">{dict.footer.privacyPolicy}</a>
            <a href="#" className="hover:text-white transition-colors">{dict.footer.termsOfService}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
