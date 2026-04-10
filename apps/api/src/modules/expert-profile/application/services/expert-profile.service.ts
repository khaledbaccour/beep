import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole, OnboardingStep, ErrorCode } from '@beep/shared';
import { ExpertProfile } from '../../domain/entities/expert-profile.entity';
import { SessionOption } from '../../domain/entities/session-option.entity';
import {
  IExpertProfileRepository,
  EXPERT_PROFILE_REPOSITORY,
  ExpertSearchFilters,
} from '../../domain/repositories/expert-profile.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../identity/domain/repositories/user.repository.interface';
import { CreateExpertProfileDto } from '../dtos/create-expert-profile.dto';
import { UpdateExpertProfileDto } from '../dtos/update-expert-profile.dto';
import { ExpertProfileResponseDto } from '../dtos/expert-profile-response.dto';
import { OnboardingStep1Dto } from '../dtos/onboarding-step-1.dto';
import { OnboardingStep2Dto } from '../dtos/onboarding-step-2.dto';
import { OnboardingStep3Dto } from '../dtos/onboarding-step-3.dto';
import { OnboardingStep4Dto } from '../dtos/onboarding-step-4.dto';
import { OnboardingStatusResponseDto } from '../dtos/onboarding-status-response.dto';
import { SlugAvailabilityResponseDto } from '../dtos/slug-availability-response.dto';
import { SessionOptionResponseDto, CreateSessionOptionDto } from '../dtos/session-option.dto';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { PaginationMeta } from '@beep/shared';

const RESERVED_SLUGS: string[] = [
  'admin',
  'api',
  'dashboard',
  'login',
  'register',
  'settings',
  'help',
  'support',
  'about',
  'marketplace',
  'search',
  'explore',
  'pricing',
  'terms',
  'privacy',
  'contact',
  'blog',
  'docs',
  'status',
  'onboarding',
  'checkout',
  'payment',
  'notifications',
  'messages',
  'profile',
  'account',
  'experts',
  'categories',
  'bookings',
  'sessions',
  'slug-available',
];

@Injectable()
export class ExpertProfileService {
  constructor(
    @Inject(EXPERT_PROFILE_REPOSITORY)
    private readonly profileRepo: IExpertProfileRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @InjectRepository(SessionOption)
    private readonly sessionOptionRepo: Repository<SessionOption>,
  ) {}

  async createProfile(
    currentUser: AuthenticatedUser,
    dto: CreateExpertProfileDto,
  ): Promise<ExpertProfileResponseDto> {
    const existingProfile = await this.profileRepo.findByUserId(currentUser.id);
    if (existingProfile) {
      throw new ConflictException(ErrorCode.EXPERT_PROFILE_ALREADY_EXISTS);
    }

    if (await this.profileRepo.slugExists(dto.slug)) {
      throw new ConflictException(ErrorCode.SLUG_ALREADY_TAKEN);
    }

    const user = await this.userRepo.findById(currentUser.id);
    if (!user) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    await this.userRepo.update(user.id, { role: UserRole.EXPERT });

    const profile = new ExpertProfile();
    profile.userId = currentUser.id;
    profile.slug = dto.slug;
    profile.bio = dto.bio;
    profile.headline = dto.headline;
    profile.category = dto.category;
    profile.tags = dto.tags;
    profile.sessionPriceMillimes = dto.sessionPriceMillimes;
    profile.sessionDurationMinutes = dto.sessionDurationMinutes ?? 60;
    profile.timezone = dto.timezone ?? 'Africa/Tunis';

    const saved = await this.profileRepo.save(profile);

    if (dto.sessionOptions && dto.sessionOptions.length > 0) {
      await this.replaceSessionOptions(saved, dto.sessionOptions);
    }

    return this.toResponseDto(saved, user.firstName, user.lastName, user.avatarUrl);
  }

  async getMyProfile(
    currentUser: AuthenticatedUser,
  ): Promise<ExpertProfileResponseDto | null> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      return null;
    }
    return this.toResponseDto(
      profile,
      profile.user.firstName,
      profile.user.lastName,
      profile.user.avatarUrl,
    );
  }

  async getBySlug(slug: string): Promise<ExpertProfileResponseDto> {
    const profile = await this.profileRepo.findBySlug(slug);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_NOT_FOUND);
    }
    return this.toResponseDto(
      profile,
      profile.user.firstName,
      profile.user.lastName,
      profile.user.avatarUrl,
    );
  }

  async search(
    filters: ExpertSearchFilters,
    page: number,
    limit: number,
  ): Promise<{ data: ExpertProfileResponseDto[]; meta: PaginationMeta }> {
    const skip = (page - 1) * limit;
    const [profiles, total] = await this.profileRepo.findAll(filters, skip, limit);

    const data = profiles.map((p) =>
      this.toResponseDto(p, p.user.firstName, p.user.lastName, p.user.avatarUrl),
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateProfile(
    currentUser: AuthenticatedUser,
    dto: UpdateExpertProfileDto,
  ): Promise<ExpertProfileResponseDto> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_PROFILE_NOT_FOUND);
    }
    if (profile.userId !== currentUser.id) {
      throw new ForbiddenException(ErrorCode.FORBIDDEN);
    }

    if (dto.slug && dto.slug !== profile.slug) {
      if (RESERVED_SLUGS.includes(dto.slug)) {
        throw new ConflictException(ErrorCode.SLUG_RESERVED);
      }
      if (await this.profileRepo.slugExists(dto.slug)) {
        throw new ConflictException(ErrorCode.SLUG_ALREADY_TAKEN);
      }
    }

    if (dto.sessionOptions) {
      await this.replaceSessionOptions(profile, dto.sessionOptions);
      delete dto.sessionOptions;
    }

    Object.assign(profile, dto);
    const saved = await this.profileRepo.save(profile);
    return this.toResponseDto(
      saved,
      profile.user.firstName,
      profile.user.lastName,
      profile.user.avatarUrl,
    );
  }

  // ── Slug Availability ──────────────────────────────────────────────

  async checkSlugAvailability(slug: string): Promise<SlugAvailabilityResponseDto> {
    const normalised = slug.toLowerCase();

    // Validate format
    if (!/^[a-z0-9-]+$/.test(normalised) || normalised.length < 3 || normalised.length > 30) {
      return new SlugAvailabilityResponseDto(normalised, false);
    }

    // Check reserved slugs
    if (RESERVED_SLUGS.includes(normalised)) {
      return new SlugAvailabilityResponseDto(normalised, false);
    }

    const exists = await this.profileRepo.slugExists(normalised);
    return new SlugAvailabilityResponseDto(normalised, !exists);
  }

  // ── Onboarding ─────────────────────────────────────────────────────

  async onboardingStep1(
    currentUser: AuthenticatedUser,
    dto: OnboardingStep1Dto,
  ): Promise<OnboardingStatusResponseDto> {
    if (currentUser.role === UserRole.ADMIN) {
      throw new ForbiddenException(ErrorCode.ADMINS_CANNOT_CREATE_PROFILE);
    }

    // Check for existing profile
    const existing = await this.profileRepo.findByUserId(currentUser.id);
    if (existing && existing.onboardingCompleted) {
      throw new ConflictException(ErrorCode.ONBOARDING_ALREADY_COMPLETED);
    }

    // Validate slug availability
    const slugCheck = await this.checkSlugAvailability(dto.slug);
    if (!slugCheck.available) {
      // Allow if it's the same user's existing slug
      if (!existing || existing.slug !== dto.slug) {
        throw new ConflictException(ErrorCode.SLUG_NOT_AVAILABLE);
      }
    }

    const user = await this.userRepo.findById(currentUser.id);
    if (!user) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    const profile = existing ?? new ExpertProfile();
    profile.userId = currentUser.id;
    profile.slug = dto.slug;
    profile.bio = dto.bio;
    profile.headline = dto.headline;
    profile.category = dto.category;
    profile.isVisible = false;
    profile.onboardingCompleted = false;
    profile.onboardingStep = OnboardingStep.BASIC_INFO;
    profile.profileCompleteness = profile.calculateCompleteness();

    const saved = await this.profileRepo.save(profile);
    return this.toOnboardingStatus(saved);
  }

  async onboardingStep2(
    currentUser: AuthenticatedUser,
    dto: OnboardingStep2Dto,
  ): Promise<OnboardingStatusResponseDto> {
    const profile = await this.getOnboardingProfile(currentUser.id);

    if (profile.onboardingStep < OnboardingStep.BASIC_INFO) {
      throw new BadRequestException(ErrorCode.COMPLETE_STEP_1_FIRST);
    }

    profile.tags = dto.tags;
    profile.certifications = dto.certifications;
    profile.yearsOfExperience = dto.yearsOfExperience;
    profile.languages = dto.languages;
    profile.onboardingStep = Math.max(profile.onboardingStep, OnboardingStep.EXPERTISE);
    profile.profileCompleteness = profile.calculateCompleteness();

    const saved = await this.profileRepo.save(profile);
    return this.toOnboardingStatus(saved);
  }

  async onboardingStep3(
    currentUser: AuthenticatedUser,
    dto: OnboardingStep3Dto,
  ): Promise<OnboardingStatusResponseDto> {
    const profile = await this.getOnboardingProfile(currentUser.id);

    if (profile.onboardingStep < OnboardingStep.EXPERTISE) {
      throw new BadRequestException(ErrorCode.COMPLETE_STEP_2_FIRST);
    }

    profile.timezone = dto.timezone ?? 'Africa/Tunis';
    await this.upsertSessionOptions(profile, dto);
    profile.onboardingStep = Math.max(profile.onboardingStep, OnboardingStep.PRICING);
    profile.profileCompleteness = profile.calculateCompleteness();
    const saved = await this.profileRepo.save(profile);
    return this.toOnboardingStatus(saved);
  }

  async onboardingStep4(
    currentUser: AuthenticatedUser,
    dto: OnboardingStep4Dto,
  ): Promise<OnboardingStatusResponseDto> {
    const profile = await this.getOnboardingProfile(currentUser.id);

    if (profile.onboardingStep < OnboardingStep.PRICING) {
      throw new BadRequestException(ErrorCode.COMPLETE_STEP_3_FIRST);
    }

    profile.payoutMethod = dto.payoutMethod;
    profile.payoutDetails = {
      accountHolderName: dto.bankTransferDetails.accountHolderName.trim(),
      iban: dto.bankTransferDetails.iban.replace(/\s/g, '').toUpperCase(),
    };
    profile.onboardingStep = Math.max(profile.onboardingStep, OnboardingStep.PAYOUT);
    profile.profileCompleteness = profile.calculateCompleteness();

    const saved = await this.profileRepo.save(profile);
    return this.toOnboardingStatus(saved);
  }

  async completeOnboarding(
    currentUser: AuthenticatedUser,
  ): Promise<OnboardingStatusResponseDto> {
    const profile = await this.getOnboardingProfile(currentUser.id);

    // Validate all required fields are filled
    const missingFields: string[] = [];
    if (!profile.slug) missingFields.push('slug');
    if (!profile.bio) missingFields.push('bio');
    if (!profile.category) missingFields.push('category');
    const hasSessionOptions = profile.sessionOptions && profile.sessionOptions.length > 0;
    if (!profile.sessionPriceMillimes && !hasSessionOptions) missingFields.push('sessionPriceMillimes');
    if (!profile.languages || profile.languages.length === 0) missingFields.push('languages');
    if (!profile.payoutMethod) missingFields.push('payoutMethod');

    if (missingFields.length > 0) {
      throw new BadRequestException(ErrorCode.MISSING_REQUIRED_FIELDS);
    }

    // Update user role to EXPERT and mark user-level onboarding complete
    const user = await this.userRepo.findById(currentUser.id);
    if (!user) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }
    await this.userRepo.update(user.id, { role: UserRole.EXPERT, onboardingCompleted: true });

    profile.onboardingCompleted = true;
    profile.isVisible = true;
    profile.profileCompleteness = profile.calculateCompleteness();

    const saved = await this.profileRepo.save(profile);
    return this.toOnboardingStatus(saved);
  }

  async getOnboardingStatus(
    currentUser: AuthenticatedUser,
  ): Promise<OnboardingStatusResponseDto> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      // No profile yet — step 1 not started
      return new OnboardingStatusResponseDto({
        currentStep: 0,
        completed: false,
        profileCompleteness: 0,
        profile: {},
      });
    }
    return this.toOnboardingStatus(profile);
  }

  // ── Private Helpers ────────────────────────────────────────────────

  private async getOnboardingProfile(userId: string): Promise<ExpertProfile> {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(ErrorCode.COMPLETE_STEP_1_FIRST);
    }
    if (profile.onboardingCompleted) {
      throw new ConflictException(ErrorCode.ONBOARDING_ALREADY_COMPLETED);
    }
    return profile;
  }

  private async upsertSessionOptions(
    profile: ExpertProfile,
    dto: OnboardingStep3Dto,
  ): Promise<void> {
    if (dto.sessionOptions && dto.sessionOptions.length > 0) {
      await this.replaceSessionOptions(profile, dto.sessionOptions);
      const first = dto.sessionOptions[0];
      profile.sessionPriceMillimes = first.priceMillimes;
      profile.sessionDurationMinutes = first.durationMinutes;
    } else if (dto.sessionPriceMillimes) {
      const optionDto: CreateSessionOptionDto = {
        durationMinutes: dto.sessionDurationMinutes ?? 60,
        priceMillimes: dto.sessionPriceMillimes,
        sortOrder: 0,
      };
      await this.replaceSessionOptions(profile, [optionDto]);
      profile.sessionPriceMillimes = dto.sessionPriceMillimes;
      profile.sessionDurationMinutes = dto.sessionDurationMinutes ?? 60;
    }
  }

  private async replaceSessionOptions(
    profile: ExpertProfile,
    options: CreateSessionOptionDto[],
  ): Promise<void> {
    await this.sessionOptionRepo.delete({ expertProfileId: profile.id });
    const entities = options.map((opt, index) => {
      const entity = new SessionOption();
      entity.expertProfileId = profile.id;
      entity.durationMinutes = opt.durationMinutes;
      entity.priceMillimes = opt.priceMillimes;
      entity.label = opt.label;
      entity.sortOrder = opt.sortOrder ?? index;
      entity.isActive = true;
      return entity;
    });
    await this.sessionOptionRepo.save(entities);
    profile.sessionOptions = entities;
    if (entities.length > 0) {
      const first = entities.sort((a, b) => a.sortOrder - b.sortOrder)[0];
      profile.sessionPriceMillimes = first.priceMillimes;
      profile.sessionDurationMinutes = first.durationMinutes;
    }
  }

  private toSessionOptionResponseDtos(profile: ExpertProfile): SessionOptionResponseDto[] {
    const options = profile.sessionOptions ?? [];
    return options
      .filter((opt) => opt.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(
        (opt) =>
          new SessionOptionResponseDto({
            id: opt.id,
            durationMinutes: opt.durationMinutes,
            priceMillimes: opt.priceMillimes,
            label: opt.label,
            isActive: opt.isActive,
            sortOrder: opt.sortOrder,
          }),
      );
  }

  private toOnboardingStatus(profile: ExpertProfile): OnboardingStatusResponseDto {
    return new OnboardingStatusResponseDto({
      currentStep: profile.onboardingStep,
      completed: profile.onboardingCompleted,
      profileCompleteness: profile.profileCompleteness,
      profile: {
        slug: profile.slug,
        bio: profile.bio,
        headline: profile.headline,
        category: profile.category,
        tags: profile.tags,
        certifications: profile.certifications,
        yearsOfExperience: profile.yearsOfExperience,
        languages: profile.languages,
        sessionPriceMillimes: profile.sessionPriceMillimes ?? undefined,
        sessionDurationMinutes: profile.sessionDurationMinutes,
        timezone: profile.timezone,
        payoutMethod: profile.payoutMethod,
        payoutDetails: profile.payoutDetails ?? undefined,
        sessionOptions: this.toSessionOptionResponseDtos(profile),
      },
    });
  }

  private toResponseDto(
    profile: ExpertProfile,
    firstName: string,
    lastName: string,
    avatarUrl?: string,
  ): ExpertProfileResponseDto {
    return new ExpertProfileResponseDto({
      id: profile.id,
      slug: profile.slug,
      firstName,
      lastName,
      avatarUrl,
      bio: profile.bio,
      headline: profile.headline,
      category: profile.category,
      tags: profile.tags,
      sessionPriceMillimes: profile.sessionPriceMillimes,
      sessionDurationMinutes: profile.sessionDurationMinutes,
      timezone: profile.timezone,
      averageRating: Number(profile.averageRating),
      totalSessions: profile.totalSessions,
      sessionOptions: this.toSessionOptionResponseDtos(profile),
    });
  }
}
