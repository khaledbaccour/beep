/**
 * Mock payment client — simulates a successful card payment without contacting
 * any external gateway. Replace with a real integration (Razorpay, Paytm, etc.)
 * before production launch in India.
 */

const PENDING_BOOKING_KEY = 'beep_pending_booking_id';

/* ── Pending-booking persistence ────────────────────────── */

export function setPendingBookingId(bookingId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PENDING_BOOKING_KEY, bookingId);
  }
}

export function getPendingBookingId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PENDING_BOOKING_KEY);
}

export function clearPendingBookingId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PENDING_BOOKING_KEY);
  }
}

/* ── Payment ─────────────────────────────────────────────── */

/**
 * Simulates a card payment. Returns a mock transaction ID and the amount.
 *
 * @param amountINR  Amount in INR (NOT paise).
 * @param description  Human-readable description.
 */
export async function payWithCard(
  amountINR: number,
  description: string,
): Promise<{ txn: string; amount: number }> {
  // Brief delay so the UI shows the "Processing..." state.
  await new Promise((resolve) => setTimeout(resolve, 500));

  void description;

  return {
    txn: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    amount: amountINR,
  };
}

/* ── Settlement (no-op in mock) ──────────────────────────── */

export async function settlePendingPayments(): Promise<{
  recovered: boolean;
  txn?: string;
  amount?: number;
  description?: string;
}> {
  return { recovered: false };
}
