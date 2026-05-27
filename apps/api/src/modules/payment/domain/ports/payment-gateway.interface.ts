export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface RecordPaymentRequest {
  bookingId: string;
  transactionId: string;
  amountPaise: number;
  currency: 'INR';
  idempotencyKey: string;
}

export interface RecordPaymentResult {
  success: boolean;
  errorMessage?: string;
}

export interface RefundRequest {
  transactionId: string;
  amountPaise: number;
  reason: string;
  idempotencyKey: string;
}

export interface RefundResult {
  success: boolean;
  /** For the mock adapter, refunds are flagged for manual handling */
  refundId: string;
  requiresManualAction: boolean;
  errorMessage?: string;
}

export interface IPaymentGateway {
  /**
   * Records a payment that was completed client-side.
   * The mock adapter accepts any payload and simulates a successful capture.
   */
  recordPayment(request: RecordPaymentRequest): Promise<RecordPaymentResult>;

  /**
   * Requests a refund. The mock adapter flags the transaction for manual
   * processing — there is no programmatic refund yet.
   */
  requestRefund(request: RefundRequest): Promise<RefundResult>;
}
