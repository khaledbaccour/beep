import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExpertProfileService } from '../../../expert-profile/application/services/expert-profile.service';
import { ExpertProfileResponseDto } from '../../../expert-profile/application/dtos/expert-profile-response.dto';
import { ExpertCategory, SKILLS_BY_CATEGORY, ALL_SKILLS } from '@beep/shared';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';
import { IsEnum, IsInt, IsOptional, IsString, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class MarketplaceSearchDto {
  @IsEnum(ExpertCategory)
  @IsOptional()
  category?: ExpertCategory;

  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}

export class SkillsQueryDto {
  @IsEnum(ExpertCategory)
  @IsOptional()
  category?: ExpertCategory;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  search?: string;
}

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly profileService: ExpertProfileService) {}

  @Get()
  async search(
    @Query() query: MarketplaceSearchDto,
  ): Promise<ApiResponseDto<ExpertProfileResponseDto[]>> {
    const { data, meta } = await this.profileService.search(
      {
        category: query.category,
        search: query.search,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      },
      query.page ?? 1,
      query.limit ?? 20,
    );
    return ApiResponseDto.paginated(data, meta);
  }

  @Get('skills')
  async skills(
    @Query() query: SkillsQueryDto,
  ): Promise<ApiResponseDto<string[]>> {
    let skills: string[];

    if (query.search) {
      const q = query.search.trim().toLowerCase();
      skills = ALL_SKILLS.filter((s) => s.includes(q)).slice(0, 20);
    } else if (query.category) {
      skills = SKILLS_BY_CATEGORY[query.category];
    } else {
      skills = ALL_SKILLS;
    }

    return ApiResponseDto.ok(skills);
  }

  @Get('featured')
  async featured(): Promise<ApiResponseDto<ExpertProfileResponseDto[]>> {
    const { data, meta } = await this.profileService.search(
      { isFeatured: true },
      1,
      10,
    );
    return ApiResponseDto.paginated(data, meta);
  }
}
