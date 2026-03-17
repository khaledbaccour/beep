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
import { OnboardingStep1Dto } from '../../application/dtos/onboarding-step-1.dto';
import { OnboardingStep2Dto } from '../../application/dtos/onboarding-step-2.dto';
import { OnboardingStep3Dto } from '../../application/dtos/onboarding-step-3.dto';
import { OnboardingStep4Dto } from '../../application/dtos/onboarding-step-4.dto';
import { OnboardingStatusResponseDto } from '../../application/dtos/onboarding-status-response.dto';
import { SlugAvailabilityResponseDto } from '../../application/dtos/slug-availability-response.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';

@ApiTags('Expert Profiles')
@Controller('experts')
export class ExpertProfileController {
  constructor(private readonly profileService: ExpertProfileService) {}

  // ── Slug Availability (public) ─────────────────────────────────────

  @Get('slug-available/:slug')
  async checkSlugAvailability(
    @Param('slug') slug: string,
  ): Promise<ApiResponseDto<SlugAvailabilityResponseDto>> {
    const result = await this.profileService.checkSlugAvailability(slug);
    return ApiResponseDto.ok(result);
  }

  // ── Onboarding Endpoints (authenticated) ───────────────────────────

  @Get('onboarding/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOnboardingStatus(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponseDto<OnboardingStatusResponseDto>> {
    const result = await this.profileService.getOnboardingStatus(user);
    return ApiResponseDto.ok(result);
  }

  @Post('onboarding/step-1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async onboardingStep1(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: OnboardingStep1Dto,
  ): Promise<ApiResponseDto<OnboardingStatusResponseDto>> {
    const result = await this.profileService.onboardingStep1(user, dto);
    return ApiResponseDto.ok(result);
  }

  @Put('onboarding/step-2')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async onboardingStep2(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: OnboardingStep2Dto,
  ): Promise<ApiResponseDto<OnboardingStatusResponseDto>> {
    const result = await this.profileService.onboardingStep2(user, dto);
    return ApiResponseDto.ok(result);
  }

  @Put('onboarding/step-3')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async onboardingStep3(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: OnboardingStep3Dto,
  ): Promise<ApiResponseDto<OnboardingStatusResponseDto>> {
    const result = await this.profileService.onboardingStep3(user, dto);
    return ApiResponseDto.ok(result);
  }

  @Put('onboarding/step-4')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async onboardingStep4(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: OnboardingStep4Dto,
  ): Promise<ApiResponseDto<OnboardingStatusResponseDto>> {
    const result = await this.profileService.onboardingStep4(user, dto);
    return ApiResponseDto.ok(result);
  }

  @Post('onboarding/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async completeOnboarding(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponseDto<OnboardingStatusResponseDto>> {
    const result = await this.profileService.completeOnboarding(user);
    return ApiResponseDto.ok(result);
  }

  // ── Existing Endpoints ─────────────────────────────────────────────

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
