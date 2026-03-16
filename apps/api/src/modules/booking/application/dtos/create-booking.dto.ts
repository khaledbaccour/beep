import { IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  expertProfileId!: string;

  @IsDateString()
  scheduledStartTime!: string;
}
