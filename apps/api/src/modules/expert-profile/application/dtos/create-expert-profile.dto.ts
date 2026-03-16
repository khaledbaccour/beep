import { IsString, IsEnum, IsInt, IsOptional, Min, Matches, IsArray, MinLength } from 'class-validator';
import { ExpertCategory } from '@beep/shared';

export class CreateExpertProfileDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase alphanumeric with hyphens' })
  slug!: string;

  @IsString()
  @MinLength(10)
  bio!: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsEnum(ExpertCategory)
  category!: ExpertCategory;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsInt()
  @Min(1000)
  sessionPriceMillimes!: number;

  @IsInt()
  @Min(15)
  @IsOptional()
  sessionDurationMinutes?: number;

  @IsString()
  @IsOptional()
  timezone?: string;
}
