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
  private readonly _apiKey: string;
  private readonly _apiSecret: string;

  constructor(private readonly configService: ConfigService) {
    this._apiKey = this.configService.get<string>('GAMMAL_TECH_API_KEY') ?? '';
    this._apiSecret = this.configService.get<string>('GAMMAL_TECH_API_SECRET') ?? '';
  }

  async capturePayment(_request: CapturePaymentRequest): Promise<CapturePaymentResult> {
    // TODO: Replace with actual Gammal Tech API call
    void this._apiKey;
    void this._apiSecret;
    return {
      success: true,
      transactionId: uuidv4(),
    };
  }

  async refund(_request: RefundRequest): Promise<RefundResult> {
    // TODO: Replace with actual Gammal Tech API call
    // POST https://api.gammaltech.tn/v1/payments/{transactionId}/refund
    return {
      success: true,
      refundId: uuidv4(),
    };
  }

  async releaseToExpert(_request: ReleasePaymentRequest): Promise<{ success: boolean }> {
    // TODO: Replace with actual Gammal Tech API call
    // POST https://api.gammaltech.tn/v1/payments/{transactionId}/release
    return { success: true };
  }
}
