import { IsString, IsEnum, IsInt, IsOptional, Min, Matches, IsArray, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExpertCategory } from '@beep/shared';
import { CreateSessionOptionDto } from './session-option.dto';

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
  sessionPriceCents!: number;

  @IsInt()
  @Min(15)
  @IsOptional()
  sessionDurationMinutes?: number;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionOptionDto)
  @IsOptional()
  sessionOptions?: CreateSessionOptionDto[];
}
