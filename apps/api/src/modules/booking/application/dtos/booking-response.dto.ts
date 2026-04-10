import { BookingStatus, RefundEligibility } from '@beep/shared';

export class BookingResponseDto {
  id: string;
  clientId: string;
  expertProfileId: string;
  expertName: string;
  clientName: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  status: BookingStatus;
  amountCents: number;
  refundAmountCents: number;
  refundEligibility: RefundEligibility;
  sessionRoomId?: string;
  durationMinutes?: number;

  constructor(partial: BookingResponseDto) {
    this.id = partial.id;
    this.clientId = partial.clientId;
    this.expertProfileId = partial.expertProfileId;
    this.expertName = partial.expertName;
    this.clientName = partial.clientName;
    this.scheduledStartTime = partial.scheduledStartTime;
    this.scheduledEndTime = partial.scheduledEndTime;
    this.status = partial.status;
    this.amountCents = partial.amountCents;
    this.refundAmountCents = partial.refundAmountCents;
    this.refundEligibility = partial.refundEligibility;
    this.sessionRoomId = partial.sessionRoomId;
    this.durationMinutes = partial.durationMinutes;
  }
}
