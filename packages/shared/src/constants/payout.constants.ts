/**
 * French IBAN: FR + 2 check digits + 23 alphanumeric = 27 characters total.
 * Input should be uppercased and whitespace-stripped before validation.
 */
export const FRENCH_IBAN_REGEX = /^FR\d{2}[A-Z0-9]{23}$/;

/**
 * Tunisian phone number: +216 followed by 8 digits (starting with 2, 3, 4, 5, 7, or 9).
 * Kept for user registration validation (register.dto.ts).
 */
export const TUNISIAN_PHONE_REGEX = /^\+216[2-9]\d{7}$/;

/**
 * Account holder name: letters (including accented), spaces, hyphens, apostrophes. 3-100 chars.
 */
export const ACCOUNT_HOLDER_NAME_REGEX = /^[\p{L}\s\-']{3,100}$/u;
