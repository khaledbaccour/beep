import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CLIENT' | 'EXPERT' | 'ADMIN';
  onboardingCompleted?: boolean;
}

export type Tab = 'overview' | 'profile' | 'availability' | 'bookings';

export interface TabProps {
  d: Dictionary['dashboard'];
  dict: Dictionary;
  lang: Locale;
}

export const DAYS = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
] as const;

export const CATEGORIES = [
  'FITNESS', 'EDUCATION', 'LAW', 'BUSINESS', 'TECHNOLOGY',
  'PSYCHOLOGY', 'NUTRITION', 'FINANCE', 'LANGUAGES', 'MUSIC', 'ART', 'OTHER',
] as const;

export function millimesToTND(millimes: number): string {
  return (millimes / 1000).toFixed(2);
}
