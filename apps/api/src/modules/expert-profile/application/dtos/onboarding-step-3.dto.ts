import { IsInt, IsOptional, IsString, Min, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSessionOptionDto } from './session-option.dto';

export class OnboardingStep3Dto {
  /** Session options with duration-based pricing */
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSessionOptionDto)
  @IsOptional()
  sessionOptions?: CreateSessionOptionDto[];

  /** @deprecated Use sessionOptions instead. Kept for backward compat. */
  @IsInt()
  @Min(1000)
  @IsOptional()
  sessionPriceCents?: number;

  /** @deprecated Use sessionOptions instead. Kept for backward compat. */
  @IsInt()
  @Min(15)
  @IsOptional()
  sessionDurationMinutes?: number;

  @IsString()
  @IsOptional()
  timezone?: string;
}
