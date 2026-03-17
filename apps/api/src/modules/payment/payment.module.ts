import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './domain/entities/payment-transaction.entity';
import { PAYMENT_GATEWAY } from './domain/ports/payment-gateway.interface';
import { GammalTechPaymentAdapter } from './infrastructure/adapters/gammal-tech-payment.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction])],
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useClass: GammalTechPaymentAdapter,
    },
  ],
  exports: [PAYMENT_GATEWAY],
})
export class PaymentModule {}
