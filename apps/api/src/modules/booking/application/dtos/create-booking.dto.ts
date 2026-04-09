import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  expertProfileId!: string;

  @IsDateString()
  scheduledStartTime!: string;

  /** ID of the selected session option (duration + price) */
  @IsString()
  @IsOptional()
  sessionOptionId?: string;
}
