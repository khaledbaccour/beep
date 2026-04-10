/**
 * French IBAN: FR + 2 check digits + 23 alphanumeric = 27 characters total.
 * Input should be uppercased and whitespace-stripped before validation.
 */
export const FRENCH_IBAN_REGEX = /^FR\d{2}[A-Z0-9]{23}$/;

/**
 * French phone number: +33 followed by 9 digits (starting with 1-9).
 * Kept for user registration validation (register.dto.ts).
 */
export const FRENCH_PHONE_REGEX = /^\+33[1-9]\d{8}$/;

/**
 * Account holder name: letters (including accented), spaces, hyphens, apostrophes. 3-100 chars.
 */
export const ACCOUNT_HOLDER_NAME_REGEX = /^[\p{L}\s\-']{3,100}$/u;
