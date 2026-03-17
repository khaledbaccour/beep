import {
  IsString,
  IsEnum,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ExpertCategory } from '@beep/shared';

export class OnboardingStep1Dto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens only',
  })
  slug!: string;

  @IsString()
  @MinLength(10)
  bio!: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsEnum(ExpertCategory)
  category!: ExpertCategory;
}
