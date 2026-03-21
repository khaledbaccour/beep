import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BookingStatus, RefundEligibility } from '@beep/shared';
import {
  FULL_REFUND_HOURS,
  PARTIAL_REFUND_HOURS,
  PARTIAL_REFUND_PERCENTAGE,
} from '@beep/shared';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { SessionOption } from '../../../expert-profile/domain/entities/session-option.entity';
import { User } from '../../../identity/domain/entities/user.entity';
import { ExpertProfile } from '../../../expert-profile/domain/entities/expert-profile.entity';

@Entity('bookings')
export class Booking extends BaseEntity {
  @Column()
  clientId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client!: User;

  @Column()
  expertProfileId!: string;

  @ManyToOne(() => ExpertProfile)
  @JoinColumn({ name: 'expertProfileId' })
  expertProfile!: ExpertProfile;

  @Column({ type: 'timestamptz' })
  scheduledStartTime!: Date;

  @Column({ type: 'timestamptz' })
  scheduledEndTime!: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING_PAYMENT,
  })
  status!: BookingStatus;

  /** Amount in millimes */
  @Column({ type: 'int' })
  amountMillimes!: number;

  @Column({ nullable: true })
  paymentId?: string;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'int', default: 0 })
  refundAmountMillimes!: number;

  @Column({ nullable: true })
  sessionRoomId?: string;

  /** Reference to the selected session option */
  @Column({ nullable: true })
  sessionOptionId?: string;

  @ManyToOne(() => SessionOption, { nullable: true })
  @JoinColumn({ name: 'sessionOptionId' })
  sessionOption?: SessionOption;

  /** Denormalized duration snapshot at booking time */
  @Column({ type: 'int', nullable: true })
  durationMinutes?: number;

  // --- Domain Logic ---

  confirm(): void {
    this.assertStatus(BookingStatus.PENDING_PAYMENT);
    this.status = BookingStatus.CONFIRMED;
  }

  startSession(): void {
    this.assertStatus(BookingStatus.CONFIRMED);
    this.status = BookingStatus.IN_PROGRESS;
  }

  complete(): void {
    this.assertStatus(BookingStatus.IN_PROGRESS);
    this.status = BookingStatus.COMPLETED;
  }

  cancelByClient(reason: string): void {
    this.assertCancellable();
    this.status = BookingStatus.CANCELLED_BY_CLIENT;
    this.cancellationReason = reason;
    this.cancelledAt = new Date();

    const eligibility = this.getRefundEligibility();
    switch (eligibility) {
      case RefundEligibility.FULL:
        this.refundAmountMillimes = this.amountMillimes;
        break;
      case RefundEligibility.PARTIAL:
        this.refundAmountMillimes = Math.round(
          (this.amountMillimes * PARTIAL_REFUND_PERCENTAGE) / 100,
        );
        break;
      case RefundEligibility.NONE:
        this.refundAmountMillimes = 0;
        break;
    }
  }

  cancelByExpert(reason: string): void {
    this.assertCancellable();
    this.status = BookingStatus.CANCELLED_BY_EXPERT;
    this.cancellationReason = reason;
    this.cancelledAt = new Date();
    this.refundAmountMillimes = this.amountMillimes;
  }

  markNoShow(isExpertNoShow: boolean): void {
    this.assertStatus(BookingStatus.CONFIRMED);
    this.status = BookingStatus.NO_SHOW;
    if (isExpertNoShow) {
      this.refundAmountMillimes = this.amountMillimes;
    } else {
      this.refundAmountMillimes = 0;
    }
  }

  dispute(): void {
    if (
      this.status !== BookingStatus.COMPLETED &&
      this.status !== BookingStatus.NO_SHOW
    ) {
      throw new Error(`Cannot dispute booking in status ${this.status}`);
    }
    this.status = BookingStatus.DISPUTED;
  }

  getRefundEligibility(now: Date = new Date()): RefundEligibility {
    const hoursUntilSession =
      (this.scheduledStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilSession >= FULL_REFUND_HOURS) {
      return RefundEligibility.FULL;
    }
    if (hoursUntilSession >= PARTIAL_REFUND_HOURS) {
      return RefundEligibility.PARTIAL;
    }
    return RefundEligibility.NONE;
  }

  isCancellable(): boolean {
    return (
      this.status === BookingStatus.PENDING_PAYMENT ||
      this.status === BookingStatus.CONFIRMED
    );
  }

  private assertCancellable(): void {
    if (!this.isCancellable()) {
      throw new Error(`Cannot cancel booking in status ${this.status}`);
    }
  }

  private assertStatus(expected: BookingStatus): void {
    if (this.status !== expected) {
      throw new Error(
        `Expected booking status ${expected}, got ${this.status}`,
      );
    }
  }
}
