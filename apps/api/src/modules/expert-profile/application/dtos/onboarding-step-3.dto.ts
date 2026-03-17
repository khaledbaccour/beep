import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OnboardingStep3Dto {
  /** Session price in millimes (TND). Minimum 1000 millimes = 1 TND */
  @IsInt()
  @Min(1000)
  sessionPriceMillimes!: number;

  /** Session duration in minutes. Minimum 15 minutes */
  @IsInt()
  @Min(15)
  @IsOptional()
  sessionDurationMinutes?: number;

  @IsString()
  @IsOptional()
  timezone?: string;
}
