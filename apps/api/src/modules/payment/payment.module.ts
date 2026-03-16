import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './domain/entities/payment-transaction.entity';
import { PAYMENT_GATEWAY } from './domain/ports/payment-gateway.interface';
import { GammalTechPaymentAdapter } from './infrastructure/adapters/gammal-tech-payment.adapter';
import { PaymentWebhookService } from './application/services/payment-webhook.service';
import { PaymentWebhookController } from './infrastructure/controllers/payment-webhook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction])],
  controllers: [PaymentWebhookController],
  providers: [
    PaymentWebhookService,
    {
      provide: PAYMENT_GATEWAY,
      useClass: GammalTechPaymentAdapter,
    },
  ],
  exports: [PAYMENT_GATEWAY],
})
export class PaymentModule {}
