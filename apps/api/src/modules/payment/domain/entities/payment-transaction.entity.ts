import { Entity, Column } from 'typeorm';
import { PaymentStatus } from '@beep/shared';
import { BaseEntity } from '../../../../common/domain/base.entity';

@Entity('payment_transactions')
export class PaymentTransaction extends BaseEntity {
  @Column()
  bookingId!: string;

  @Column()
  externalTransactionId!: string;

  @Column({ type: 'int' })
  amountMillimes!: number;

  @Column({ default: 'TND' })
  currency!: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ unique: true })
  idempotencyKey!: string;

  @Column({ type: 'int', default: 0 })
  refundedAmountMillimes!: number;

  @Column({ nullable: true })
  gatewayResponse?: string;
}
