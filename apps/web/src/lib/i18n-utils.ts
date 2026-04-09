import type { Locale } from '@/i18n';
import type { Dictionary } from '@/i18n/types';

export function localePath(lang: Locale, path: string): string {
  if (lang === 'fr') return path;
  return `/${lang}${path}`;
}

export function translateError(
  message: string,
  dictOrErrors: Dictionary | Record<string, string>,
): string {
  const apiErrors = 'apiErrors' in dictOrErrors
    ? (dictOrErrors.apiErrors as Record<string, string>)
    : dictOrErrors;
  return apiErrors[message] ?? apiErrors['UNKNOWN_ERROR'] ?? message;
}
