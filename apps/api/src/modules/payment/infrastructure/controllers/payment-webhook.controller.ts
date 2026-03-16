import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentWebhookService } from '../../application/services/payment-webhook.service';

export class WebhookPayloadDto {
  event!: string;
  transactionId!: string;
  status!: string;
  amountMillimes!: number;
  metadata?: Record<string, string>;
}

@ApiTags('Payment Webhooks')
@Controller('webhooks/payment')
export class PaymentWebhookController {
  constructor(private readonly webhookService: PaymentWebhookService) {}

  @Post()
  async handleWebhook(
    @Body() payload: WebhookPayloadDto,
    @Headers('x-webhook-signature') signature: string,
  ): Promise<{ received: boolean }> {
    await this.webhookService.processWebhook(payload, signature);
    return { received: true };
  }
}
