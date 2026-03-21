export type SessionAccessReason = 'TOO_EARLY' | 'EXPIRED' | 'NOT_FOUND' | 'FORBIDDEN';

export class SessionAccessResponseDto {
  allowed: boolean;
  reason?: SessionAccessReason;
  scheduledStartTime?: Date;
  scheduledEndTime?: Date;
  expertName?: string;
  clientName?: string;
  minutesUntilStart?: number;

  constructor(partial: Partial<SessionAccessResponseDto> & { allowed: boolean }) {
    this.allowed = partial.allowed;
    this.reason = partial.reason;
    this.scheduledStartTime = partial.scheduledStartTime;
    this.scheduledEndTime = partial.scheduledEndTime;
    this.expertName = partial.expertName;
    this.clientName = partial.clientName;
    this.minutesUntilStart = partial.minutesUntilStart;
  }
}
