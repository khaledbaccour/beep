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
        { label: dict.footer.categoriesLink, href: '#categories' },
        { label: dict.footer.howItWorksLink, href: '#how-it-works' },
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
    <footer className="border-t border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-ink-900 flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">b</span>
              </div>
              <span className="text-sm font-display font-bold text-ink-900">
                beep<span className="text-brand-500">.tn</span>
              </span>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed max-w-[240px] mb-4">
              {dict.footer.description}
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-ink-900 uppercase tracking-wider mb-3">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-400 hover:text-ink-700 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-8 border-t border-ink-100 gap-3">
          <p className="text-xs text-ink-400">
            &copy; {new Date().getFullYear()} {dict.footer.copyright}
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-400">
            <a href="#" className="hover:text-ink-700 transition-colors">{dict.footer.privacyPolicy}</a>
            <a href="#" className="hover:text-ink-700 transition-colors">{dict.footer.termsOfService}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
