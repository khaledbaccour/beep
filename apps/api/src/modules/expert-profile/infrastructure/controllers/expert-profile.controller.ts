import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExpertProfileService } from '../../application/services/expert-profile.service';
import { CreateExpertProfileDto } from '../../application/dtos/create-expert-profile.dto';
import { ExpertProfileResponseDto } from '../../application/dtos/expert-profile-response.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';

@ApiTags('Expert Profiles')
@Controller('experts')
export class ExpertProfileController {
  constructor(private readonly profileService: ExpertProfileService) {}

  @Get(':slug')
  async getBySlug(
    @Param('slug') slug: string,
  ): Promise<ApiResponseDto<ExpertProfileResponseDto>> {
    const result = await this.profileService.getBySlug(slug);
    return ApiResponseDto.ok(result);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateExpertProfileDto,
  ): Promise<ApiResponseDto<ExpertProfileResponseDto>> {
    const result = await this.profileService.createProfile(user, dto);
    return ApiResponseDto.ok(result);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: Partial<CreateExpertProfileDto>,
  ): Promise<ApiResponseDto<ExpertProfileResponseDto>> {
    const result = await this.profileService.updateProfile(user, dto);
    return ApiResponseDto.ok(result);
  }
}
