/**
 * Gammal Tech Payment SDK integration (v3).
 *
 * The SDK is a client-side script that opens a payment popup.
 * Security is based on domain whitelisting — no API keys.
 * All payments go to the platform owner's Gammal Tech account.
 *
 * SDK reference: https://api.gammal.tech/sdk-web.js
 * Guide: https://www.gammal.tech/blog/how-to-add-card-payments.html
 */

const SDK_URL =
  process.env.NEXT_PUBLIC_GAMMAL_TECH_SDK_URL ?? 'https://api.gammal.tech/sdk-web.js';

/**
 * When true, skip Gammal Tech SDK entirely and auto-succeed payments.
 * Auto-enabled on Vercel preview/development deployments and when
 * NEXT_PUBLIC_DEV_PAYMENT is explicitly set.
 */
const DEV_PAYMENT =
  process.env.NEXT_PUBLIC_DEV_PAYMENT === 'true' ||
  (!!process.env.NEXT_PUBLIC_VERCEL_ENV &&
    process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production');

/* ── SDK type definitions (from SDK v3.0.2 source) ─────── */

interface PayCardDelivery {
  txn: string;
  amount: number;
  description: string;
}

interface PayCardResult {
  success: boolean;
  txn: string;
  amount: number;
  delivered_at: string;
}

interface SettlePendingResult {
  has_pending: boolean;
  payment_token?: string;
  description?: string;
  amount?: number;
}

interface VerifyPaymentResult {
  valid: boolean;
  txn: string;
  amount: number;
  description: string;
}

interface GammalTechPaymentAPI {
  settlePending: (token?: string | null) => Promise<SettlePendingResult>;
  verifyPayment: (
    token: string | null,
    paymentToken: string,
  ) => Promise<VerifyPaymentResult>;
  confirmDelivery: (token?: string | null) => Promise<void>;
}

interface GammalTechSDK {
  login: () => Promise<string>;
  logout: (token?: string) => Promise<boolean>;
  verify: (token?: string) => Promise<{ valid: boolean }>;
  isLoggedIn: () => boolean;
  getToken: () => string | null;
  onAuth: (
    onLoggedIn: (token: string) => void,
    onLoggedOut: () => void,
  ) => Promise<boolean>;
  payCard: (
    amount: number,
    currency: string,
    description: string,
    onDeliver: (delivery: PayCardDelivery) => void,
  ) => Promise<PayCardResult>;
  payment: GammalTechPaymentAPI;
}

/* ── Helpers ──────────────────────────────────────────────── */

function getSDK(): GammalTechSDK | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as Record<string, unknown>)
    .GammalTech as GammalTechSDK | undefined;
}

/* ── SDK Loader ──────────────────────────────────────────── */

let loadPromise: Promise<void> | null = null;

/**
 * Dynamically loads the Gammal Tech SDK script tag.
 * Subsequent calls return the same promise (idempotent).
 */
export function loadGammalTechSDK(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (getSDK()) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Gammal Tech payment SDK'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

/* ── Pending-booking persistence ────────────────────────── */

const PENDING_BOOKING_KEY = 'beep_pending_booking_id';

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

/* ── Auth helpers ────────────────────────────────────────── */

export async function ensureGammalTechLogin(): Promise<string> {
  if (DEV_PAYMENT) return 'dev_token';

  await loadGammalTechSDK();
  const sdk = getSDK();
  if (!sdk) throw new Error('Gammal Tech SDK not available');

  if (sdk.isLoggedIn()) {
    return sdk.getToken()!;
  }

  return sdk.login();
}

export function isGammalTechLoggedIn(): boolean {
  if (DEV_PAYMENT) return true;
  const sdk = getSDK();
  return sdk?.isLoggedIn() ?? false;
}

/* ── Payment ─────────────────────────────────────────────── */

/**
 * Opens the Gammal Tech card payment popup.
 *
 * When NEXT_PUBLIC_DEV_PAYMENT=true, skips the SDK popup entirely
 * and returns a fake successful transaction for development/testing.
 *
 * @param amountTND  Amount in TND (NOT millimes).
 * @param description  Human-readable description shown on receipt.
 * @returns The transaction details on success.
 */
export async function payWithCard(
  amountTND: number,
  description: string,
): Promise<{ txn: string; amount: number }> {
  if (DEV_PAYMENT) {
    return {
      txn: `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount: amountTND,
    };
  }

  await loadGammalTechSDK();

  const sdk = getSDK();
  if (!sdk?.payCard) {
    throw new Error('Gammal Tech SDK not available');
  }

  if (!sdk.isLoggedIn()) {
    await sdk.login();
  }

  return new Promise<{ txn: string; amount: number }>((resolve, reject) => {
    sdk
      .payCard(amountTND, 'TND', description, (delivery) => {
        resolve({ txn: delivery.txn, amount: delivery.amount });
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}

/* ── Settlement (recover interrupted payments) ───────────── */

/**
 * Recovers any paid-but-undelivered transactions from prior sessions.
 * Must be called on every page load for logged-in users.
 *
 * Returns the recovered transaction info if a pending payment was found,
 * so the caller can confirm it with the backend.
 */
export async function settlePendingPayments(): Promise<{
  recovered: boolean;
  txn?: string;
  amount?: number;
  description?: string;
}> {
  if (DEV_PAYMENT) return { recovered: false };

  await loadGammalTechSDK();

  const sdk = getSDK();
  if (!sdk?.payment?.settlePending || !sdk.isLoggedIn()) {
    return { recovered: false };
  }

  const result = await sdk.payment.settlePending();

  if (!result.has_pending || !result.payment_token) {
    return { recovered: false };
  }

  const verified = await sdk.payment.verifyPayment(null, result.payment_token);

  if (!verified.valid) {
    return { recovered: false };
  }

  await sdk.payment.confirmDelivery();

  // Check for more pending payments (recursive)
  const more = await settlePendingPayments();

  // Return the first recovered payment (caller handles it)
  return {
    recovered: true,
    txn: verified.txn,
    amount: verified.amount,
    description: verified.description,
  };
}
