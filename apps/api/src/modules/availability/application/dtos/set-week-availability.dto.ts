import { IsString, Matches, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class WeekSlotDto {
  @IsDateString()
  date!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, { message: 'startTime must be HH:mm format' })
  startTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, { message: 'endTime must be HH:mm format' })
  endTime!: string;
}

export class SetWeekAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeekSlotDto)
  slots!: WeekSlotDto[];
}
