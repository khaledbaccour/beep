import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './domain/entities/payment-transaction.entity';
import { PAYMENT_GATEWAY } from './domain/ports/payment-gateway.interface';
import { MockPaymentAdapter } from './infrastructure/adapters/mock-payment.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction])],
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useClass: MockPaymentAdapter,
    },
  ],
  exports: [PAYMENT_GATEWAY],
})
export class PaymentModule {}
