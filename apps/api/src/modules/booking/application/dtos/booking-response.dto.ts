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
  amountMillimes: number;
  refundAmountMillimes: number;
  refundEligibility: RefundEligibility;
  sessionRoomId?: string;

  constructor(partial: BookingResponseDto) {
    this.id = partial.id;
    this.clientId = partial.clientId;
    this.expertProfileId = partial.expertProfileId;
    this.expertName = partial.expertName;
    this.clientName = partial.clientName;
    this.scheduledStartTime = partial.scheduledStartTime;
    this.scheduledEndTime = partial.scheduledEndTime;
    this.status = partial.status;
    this.amountMillimes = partial.amountMillimes;
    this.refundAmountMillimes = partial.refundAmountMillimes;
    this.refundEligibility = partial.refundEligibility;
    this.sessionRoomId = partial.sessionRoomId;
  }
}
