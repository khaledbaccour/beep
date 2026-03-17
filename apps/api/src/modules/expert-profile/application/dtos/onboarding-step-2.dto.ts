import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CertificationDto {
  @IsString()
  name!: string;

  @IsString()
  issuer!: string;

  @IsInt()
  @Min(1950)
  @Max(2030)
  year!: number;
}

export class OnboardingStep2Dto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  @IsOptional()
  certifications?: CertificationDto[];

  @IsInt()
  @Min(0)
  @Max(70)
  @IsOptional()
  yearsOfExperience?: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  languages!: string[];
}
