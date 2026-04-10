export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface RecordPaymentRequest {
  bookingId: string;
  transactionId: string;
  amountCents: number;
  currency: 'EUR';
  idempotencyKey: string;
}

export interface RecordPaymentResult {
  success: boolean;
  errorMessage?: string;
}

export interface RefundRequest {
  transactionId: string;
  amountCents: number;
  reason: string;
  idempotencyKey: string;
}

export interface RefundResult {
  success: boolean;
  /** For Gammal Tech, refunds are manual — this is the internal tracking ID */
  refundId: string;
  requiresManualAction: boolean;
  errorMessage?: string;
}

export interface IPaymentGateway {
  /**
   * Records a payment that was completed client-side via the SDK.
   * Gammal Tech has no server-side capture — the frontend popup handles charging.
   */
  recordPayment(request: RecordPaymentRequest): Promise<RecordPaymentResult>;

  /**
   * Requests a refund. For Gammal Tech, this flags the transaction for manual
   * processing since there is no programmatic refund API.
   */
  requestRefund(request: RefundRequest): Promise<RefundResult>;
}
