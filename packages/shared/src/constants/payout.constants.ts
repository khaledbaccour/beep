/**
 * Indian IFSC code: 4 letters + 0 + 6 alphanumeric = 11 characters.
 * Input should be uppercased and whitespace-stripped before validation.
 */
export const INDIAN_IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/**
 * Indian bank account number: 9 to 18 digits (covers all major banks).
 */
export const INDIAN_ACCOUNT_REGEX = /^\d{9,18}$/;

/**
 * UPI virtual payment address: handle@provider (e.g. priya@okaxis, 9876543210@paytm).
 */
export const UPI_REGEX = /^[\w.\-]+@[\w.\-]+$/;

/**
 * Indian mobile number: +91 followed by 10 digits starting with 6, 7, 8, or 9.
 * Kept for user registration validation (register.dto.ts).
 */
export const INDIAN_PHONE_REGEX = /^\+91[6-9]\d{9}$/;

/**
 * Account holder name: letters (including accented), spaces, hyphens, apostrophes. 3-100 chars.
 */
export const ACCOUNT_HOLDER_NAME_REGEX = /^[\p{L}\s\-']{3,100}$/u;
