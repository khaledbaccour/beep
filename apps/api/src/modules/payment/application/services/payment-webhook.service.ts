import { Injectable, BadRequestException } from '@nestjs/common';
import { ErrorCode } from '@beep/shared';
import { ConfigService } from '@nestjs/config';
import { WebhookPayloadDto } from '../../infrastructure/controllers/payment-webhook.controller';

@Injectable()
export class PaymentWebhookService {
  private readonly _webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    this._webhookSecret =
      this.configService.get<string>('GAMMAL_TECH_WEBHOOK_SECRET') ?? '';
  }

  async processWebhook(
    payload: WebhookPayloadDto,
    signature: string,
  ): Promise<void> {
    if (!this.verifySignature(payload, signature)) {
      throw new BadRequestException(ErrorCode.INVALID_WEBHOOK_SIGNATURE);
    }

    switch (payload.event) {
      case 'payment.captured':
        // Handle payment confirmation
        break;
      case 'payment.failed':
        // Handle payment failure
        break;
      case 'payment.refunded':
        // Handle refund confirmation
        break;
      default:
        break;
    }
  }

  private verifySignature(
    _payload: WebhookPayloadDto,
    _signature: string,
  ): boolean {
    // TODO: Implement HMAC signature verification
    void this._webhookSecret;
    return true;
  }
}
