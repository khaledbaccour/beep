import { IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class CreateSessionOptionDto {
  @IsInt()
  @Min(15)
  durationMinutes!: number;

  @IsInt()
  @Min(1000)
  priceCents!: number;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  label?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class SessionOptionResponseDto {
  id: string;
  durationMinutes: number;
  priceCents: number;
  label?: string;
  isActive: boolean;
  sortOrder: number;

  constructor(partial: SessionOptionResponseDto) {
    this.id = partial.id;
    this.durationMinutes = partial.durationMinutes;
    this.priceCents = partial.priceCents;
    this.label = partial.label;
    this.isActive = partial.isActive;
    this.sortOrder = partial.sortOrder;
  }
}
