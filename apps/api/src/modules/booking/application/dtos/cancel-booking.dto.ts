import { IsString, MinLength } from 'class-validator';

export class CancelBookingDto {
  @IsString()
  @MinLength(5)
  reason!: string;
}
