import type { Locale } from '@/i18n';

export function localePath(lang: Locale, path: string): string {
  if (lang === 'fr') return path;
  return `/${lang}${path}`;
}
