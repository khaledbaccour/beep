/**
 * Major Tunisian banks recognized for payout.
 * Used for validation on both frontend and backend.
 */
export const TUNISIAN_BANKS = [
  'BIAT',
  'Attijari Bank',
  'STB',
  'BNA',
  'BH Bank',
  'Amen Bank',
  'UIB',
  'BT',
  'UBCI',
  'ABC',
  'Zitouna Bank',
  'Al Baraka Bank',
  'Wifak Bank',
  'QNB',
  'Citibank',
  'BTL',
  'TSB',
  'BTK',
  'BTS',
  'Other',
] as const;

export type TunisianBank = (typeof TUNISIAN_BANKS)[number];

/**
 * Supported mobile money providers in Tunisia.
 */
export const MOBILE_PROVIDERS = ['D17', 'Flouci', 'Sobflous', 'MobiDinar'] as const;

export type MobileProvider = (typeof MOBILE_PROVIDERS)[number];

/**
 * Tunisian RIB is exactly 20 digits.
 * Tunisian IBAN is TN59 + 20 digits = 24 characters total.
 */
export const TUNISIAN_IBAN_REGEX = /^TN59\d{20}$/;
export const TUNISIAN_RIB_REGEX = /^[0-9]{20}$/;

/**
 * Tunisian phone number: +216 followed by 8 digits (starting with 2, 3, 4, 5, 7, or 9).
 */
export const TUNISIAN_PHONE_REGEX = /^\+216[2-9]\d{7}$/;

/**
 * Account holder name: letters (including accented), spaces, hyphens, apostrophes. 3-100 chars.
 */
export const ACCOUNT_HOLDER_NAME_REGEX = /^[\p{L}\s\-']{3,100}$/u;
