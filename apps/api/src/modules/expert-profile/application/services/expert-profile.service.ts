import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@beep/shared';
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
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { PaginationMeta } from '@beep/shared';

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
