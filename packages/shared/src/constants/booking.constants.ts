/**
 * How far ahead (in days) a client may book a session.
 * Bookings are intentionally limited to a short rolling window so the calendar
 * stays dense/credible and experts are never booked months in advance.
 */
export const BOOKING_MAX_DAYS_AHEAD = 30;
