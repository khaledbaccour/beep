import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { PayoutMethod } from '@beep/shared';

export class OnboardingStep4Dto {
  @IsEnum(PayoutMethod)
  payoutMethod!: PayoutMethod;

  @IsObject()
  @IsOptional()
  payoutDetails?: Record<string, string>;
}
