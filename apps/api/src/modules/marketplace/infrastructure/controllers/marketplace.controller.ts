import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExpertProfileService } from '../../../expert-profile/application/services/expert-profile.service';
import { ExpertProfileResponseDto } from '../../../expert-profile/application/dtos/expert-profile-response.dto';
import { ExpertCategory, PaginationMeta } from '@beep/shared';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';
import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
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
