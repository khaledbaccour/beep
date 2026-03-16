import type { Dictionary } from './types';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  fr: () => import('./dictionaries/fr.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  ar: () => import('./dictionaries/ar.json').then((m) => m.default),
};

export const i18n = {
  defaultLocale: 'fr' as const,
  locales: ['fr', 'en', 'ar'] as const,
};

export type Locale = (typeof i18n)['locales'][number];

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.fr)();
}
