import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IPaymentGateway,
  CapturePaymentRequest,
  CapturePaymentResult,
  RefundRequest,
  RefundResult,
  ReleasePaymentRequest,
} from '../../domain/ports/payment-gateway.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GammalTechPaymentAdapter implements IPaymentGateway {
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GAMMAL_TECH_API_KEY') ?? '';
    this.apiSecret = this.configService.get<string>('GAMMAL_TECH_API_SECRET') ?? '';
  }

  async capturePayment(request: CapturePaymentRequest): Promise<CapturePaymentResult> {
    // TODO: Replace with actual Gammal Tech API call
    // POST https://api.gammaltech.tn/v1/payments/capture
    // Headers: { Authorization: `Bearer ${this.apiKey}` }
    // Body: { amount: request.amountMillimes, currency: request.currency, reference: request.bookingId, idempotency_key: request.idempotencyKey }
    return {
      success: true,
      transactionId: uuidv4(),
    };
  }

  async refund(request: RefundRequest): Promise<RefundResult> {
    // TODO: Replace with actual Gammal Tech API call
    // POST https://api.gammaltech.tn/v1/payments/{transactionId}/refund
    return {
      success: true,
      refundId: uuidv4(),
    };
  }

  async releaseToExpert(request: ReleasePaymentRequest): Promise<{ success: boolean }> {
    // TODO: Replace with actual Gammal Tech API call
    // POST https://api.gammaltech.tn/v1/payments/{transactionId}/release
    return { success: true };
  }
}
