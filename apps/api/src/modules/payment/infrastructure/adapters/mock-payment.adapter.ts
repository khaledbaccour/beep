import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatus } from '@beep/shared';
import {
  IPaymentGateway,
  RecordPaymentRequest,
  RecordPaymentResult,
  RefundRequest,
  RefundResult,
} from '../../domain/ports/payment-gateway.interface';
import { PaymentTransaction } from '../../domain/entities/payment-transaction.entity';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock payment adapter — simulates a successful capture and queues refunds for
 * manual processing. Replace with a real gateway (Razorpay, Paytm, etc.) when
 * launching in production.
 */
@Injectable()
export class MockPaymentAdapter implements IPaymentGateway {
  private readonly logger = new Logger(MockPaymentAdapter.name);

  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly txnRepo: Repository<PaymentTransaction>,
  ) {}

  async recordPayment(request: RecordPaymentRequest): Promise<RecordPaymentResult> {
    const existing = await this.txnRepo.findOne({
      where: { idempotencyKey: request.idempotencyKey },
    });

    if (existing) {
      this.logger.warn(
        `[Mock] Duplicate payment recording attempt: ${request.idempotencyKey}`,
      );
      return { success: true };
    }

    const txn = this.txnRepo.create({
      bookingId: request.bookingId,
      externalTransactionId: request.transactionId,
      amountPaise: request.amountPaise,
      currency: request.currency,
      status: PaymentStatus.CAPTURED,
      idempotencyKey: request.idempotencyKey,
    });

    await this.txnRepo.save(txn);

    this.logger.log(
      `[Mock] Payment recorded: booking=${request.bookingId} txn=${request.transactionId} amount=${request.amountPaise}`,
    );

    return { success: true };
  }

  async requestRefund(request: RefundRequest): Promise<RefundResult> {
    const txn = await this.txnRepo.findOne({
      where: { externalTransactionId: request.transactionId },
    });

    if (!txn) {
      return {
        success: false,
        refundId: '',
        requiresManualAction: false,
        errorMessage: 'Transaction not found',
      };
    }

    const refundId = uuidv4();
    txn.refundedAmountPaise += request.amountPaise;
    txn.status = PaymentStatus.PENDING_REFUND;

    txn.gatewayResponse = JSON.stringify({
      refundId,
      reason: request.reason,
      requestedAt: new Date().toISOString(),
      note: 'Mock payment adapter — process refund manually until a real gateway is integrated.',
    });

    await this.txnRepo.save(txn);

    this.logger.warn(
      `[Mock] Manual refund flagged: txn=${request.transactionId} amount=${request.amountPaise} refundId=${refundId}`,
    );

    return {
      success: true,
      refundId,
      requiresManualAction: true,
    };
  }
}
