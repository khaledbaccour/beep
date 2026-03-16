export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface CapturePaymentRequest {
  bookingId: string;
  amountMillimes: number;
  currency: 'TND';
  idempotencyKey: string;
}

export interface CapturePaymentResult {
  success: boolean;
  transactionId: string;
  errorMessage?: string;
}

export interface RefundRequest {
  transactionId: string;
  amountMillimes: number;
  idempotencyKey: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  errorMessage?: string;
}

export interface ReleasePaymentRequest {
  transactionId: string;
  idempotencyKey: string;
}

export interface IPaymentGateway {
  capturePayment(request: CapturePaymentRequest): Promise<CapturePaymentResult>;
  refund(request: RefundRequest): Promise<RefundResult>;
  releaseToExpert(request: ReleasePaymentRequest): Promise<{ success: boolean }>;
}
