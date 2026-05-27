import type { Dictionary } from './types';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  hi: () => import('./dictionaries/hi.json').then((m) => m.default),
};

export const i18n = {
  defaultLocale: 'en' as const,
  locales: ['en', 'hi'] as const,
};

export type Locale = (typeof i18n)['locales'][number];

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.en)();
}
