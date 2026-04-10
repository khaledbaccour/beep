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

@Injectable()
export class GammalTechPaymentAdapter implements IPaymentGateway {
  private readonly logger = new Logger(GammalTechPaymentAdapter.name);

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
        `Duplicate payment recording attempt: ${request.idempotencyKey}`,
      );
      return { success: true };
    }

    const txn = this.txnRepo.create({
      bookingId: request.bookingId,
      externalTransactionId: request.transactionId,
      amountCents: request.amountCents,
      currency: request.currency,
      status: PaymentStatus.CAPTURED,
      idempotencyKey: request.idempotencyKey,
    });

    await this.txnRepo.save(txn);

    this.logger.log(
      `Payment recorded: booking=${request.bookingId} txn=${request.transactionId} amount=${request.amountCents}`,
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
    txn.refundedAmountCents += request.amountCents;

    if (txn.refundedAmountCents >= txn.amountCents) {
      txn.status = PaymentStatus.PENDING_REFUND;
    } else {
      txn.status = PaymentStatus.PENDING_REFUND;
    }

    txn.gatewayResponse = JSON.stringify({
      refundId,
      reason: request.reason,
      requestedAt: new Date().toISOString(),
      note: 'Gammal Tech has no refund API. Process manually via dashboard or contact support@gammal.tech.',
    });

    await this.txnRepo.save(txn);

    this.logger.warn(
      `Manual refund required: txn=${request.transactionId} amount=${request.amountCents} refundId=${refundId}`,
    );

    return {
      success: true,
      refundId,
      requiresManualAction: true,
    };
  }
}
