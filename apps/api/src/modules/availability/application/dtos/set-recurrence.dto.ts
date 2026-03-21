import { IsBoolean, IsOptional, IsDateString, ValidateIf } from 'class-validator';

export class SetRecurrenceDto {
  @IsBoolean()
  isRecurring!: boolean;

  @IsOptional()
  @ValidateIf((o) => o.recurringUntil !== null && o.recurringUntil !== undefined)
  @IsDateString()
  recurringUntil?: string | null;
}
