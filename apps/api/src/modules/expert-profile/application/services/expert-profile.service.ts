import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserRole, OnboardingStep } from '@beep/shared';
import { ExpertProfile } from '../../domain/entities/expert-profile.entity';
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
import { ExpertProfileResponseDto } from '../dtos/expert-profile-response.dto';
import { OnboardingStep1Dto } from '../dtos/onboarding-step-1.dto';
import { OnboardingStep2Dto } from '../dtos/onboarding-step-2.dto';
import { OnboardingStep3Dto } from '../dtos/onboarding-step-3.dto';
import { OnboardingStep4Dto } from '../dtos/onboarding-step-4.dto';
import { OnboardingStatusResponseDto } from '../dtos/onboarding-status-response.dto';
import { SlugAvailabilityResponseDto } from '../dtos/slug-availability-response.dto';
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
  ) {}

  async createProfile(
    currentUser: AuthenticatedUser,
    dto: CreateExpertProfileDto,
  ): Promise<ExpertProfileResponseDto> {
    const existingProfile = await this.profileRepo.findByUserId(currentUser.id);
    if (existingProfile) {
      throw new ConflictException('Expert profile already exists');
    }

    if (await this.profileRepo.slugExists(dto.slug)) {
      throw new ConflictException('Slug already taken');
    }

    const user = await this.userRepo.findById(currentUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
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
    return this.toResponseDto(saved, user.firstName, user.lastName, user.avatarUrl);
  }

  async getBySlug(slug: string): Promise<ExpertProfileResponseDto> {
    const profile = await this.profileRepo.findBySlug(slug);
    if (!profile) {
      throw new NotFoundException('Expert not found');
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
    dto: Partial<CreateExpertProfileDto>,
  ): Promise<ExpertProfileResponseDto> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      throw new NotFoundException('Expert profile not found');
    }
    if (profile.userId !== currentUser.id) {
      throw new ForbiddenException();
    }

    if (dto.slug && dto.slug !== profile.slug) {
      if (RESERVED_SLUGS.includes(dto.slug)) {
        throw new ConflictException('This slug is reserved');
      }
      if (await this.profileRepo.slugExists(dto.slug)) {
        throw new ConflictException('Slug already taken');
      }
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
    // Check for existing profile
    const existing = await this.profileRepo.findByUserId(currentUser.id);
    if (existing && existing.onboardingCompleted) {
      throw new ConflictException('Onboarding already completed');
    }

    // Validate slug availability
    const slugCheck = await this.checkSlugAvailability(dto.slug);
    if (!slugCheck.available) {
      // Allow if it's the same user's existing slug
      if (!existing || existing.slug !== dto.slug) {
        throw new ConflictException('Slug is not available');
      }
    }

    const user = await this.userRepo.findById(currentUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
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
      throw new BadRequestException('Complete step 1 first');
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
      throw new BadRequestException('Complete step 2 first');
    }

    profile.sessionPriceMillimes = dto.sessionPriceMillimes;
    profile.sessionDurationMinutes = dto.sessionDurationMinutes ?? 60;
    profile.timezone = dto.timezone ?? 'Africa/Tunis';
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
      throw new BadRequestException('Complete step 3 first');
    }

    profile.payoutMethod = dto.payoutMethod;
    profile.payoutDetails = dto.payoutDetails;
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
    if (!profile.sessionPriceMillimes) missingFields.push('sessionPriceMillimes');
    if (!profile.languages || profile.languages.length === 0) missingFields.push('languages');
    if (!profile.payoutMethod) missingFields.push('payoutMethod');

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // Update user role to EXPERT
    const user = await this.userRepo.findById(currentUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.update(user.id, { role: UserRole.EXPERT });

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
      throw new NotFoundException(
        'Expert profile not found. Complete step 1 first.',
      );
    }
    if (profile.onboardingCompleted) {
      throw new ConflictException('Onboarding already completed');
    }
    return profile;
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
    });
  }
}
