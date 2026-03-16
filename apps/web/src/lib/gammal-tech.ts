/**
 * Gammal Tech Payment SDK integration.
 *
 * All payments go to the platform owner's account.
 * The SDK is a client-side script that opens a payment popup.
 */

const SDK_URL =
  process.env.NEXT_PUBLIC_GAMMAL_TECH_SDK_URL ?? 'https://api.gammal.tech/sdk-web.js';

const DOMAIN =
  process.env.NEXT_PUBLIC_GAMMAL_TECH_DOMAIN ?? undefined;

/* ── SDK type definitions ─────────────────────────────────── */

interface GammalTechPayResult {
  token: string;
}

interface GammalTechPaymentAPI {
  pay: (opts: {
    amount: number;
    currency: string;
    description: string;
    domain?: string;
  }) => Promise<GammalTechPayResult>;
  settlePending: () => Promise<void>;
}

interface GammalTechSDK {
  payment: GammalTechPaymentAPI;
}

/* ── Helpers ──────────────────────────────────────────────── */

function getSDK(): GammalTechSDK | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as Record<string, unknown>).GammalTech as GammalTechSDK | undefined;
}

/* ── Public API ───────────────────────────────────────────── */

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

/**
 * Opens the Gammal Tech payment popup.
 *
 * @param amount   Amount in TND (NOT millimes).
 * @param description  Human-readable description shown in the popup.
 * @returns The payment token on success.
 */
export async function initiatePayment(
  amount: number,
  description: string,
): Promise<GammalTechPayResult> {
  await loadGammalTechSDK();

  const sdk = getSDK();
  if (!sdk?.payment?.pay) {
    throw new Error('Gammal Tech SDK not available');
  }

  const opts: Parameters<GammalTechPaymentAPI['pay']>[0] = {
    amount,
    currency: 'TND',
    description,
  };

  if (DOMAIN) {
    opts.domain = DOMAIN;
  }

  return sdk.payment.pay(opts);
}

/**
 * Settles any pending/undelivered payments from prior sessions.
 * Should be called once on page load.
 */
export async function settlePendingPayments(): Promise<void> {
  await loadGammalTechSDK();

  const sdk = getSDK();
  if (sdk?.payment?.settlePending) {
    await sdk.payment.settlePending();
  }
}
