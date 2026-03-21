import { IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class SetRecurrenceDto {
  @IsBoolean()
  isRecurring!: boolean;

  @IsOptional()
  @IsDateString()
  recurringUntil?: string | null;
}
