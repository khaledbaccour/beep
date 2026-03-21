import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import {
  IExpertProfileRepository,
  EXPERT_PROFILE_REPOSITORY,
} from '../../../expert-profile/domain/repositories/expert-profile.repository.interface';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto, UserProfileDto } from '../dtos/auth-response.dto';
import { AuthenticatedUser } from '../../domain/interfaces/authenticated-user.interface';
import { UserRole, ErrorCode } from '@beep/shared';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(EXPERT_PROFILE_REPOSITORY)
    private readonly profileRepository: IExpertProfileRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(ErrorCode.EMAIL_ALREADY_REGISTERED);
    }

    const normalizedPhone = dto.phone.replace(/\s+/g, '');

    const existingPhone = await this.userRepository.findByPhone(normalizedPhone);
    if (existingPhone) {
      throw new ConflictException(ErrorCode.PHONE_ALREADY_REGISTERED);
    }

    const user = new User();
    user.email = dto.email;
    user.passwordHash = await bcrypt.hash(dto.password, 12);
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.role = UserRole.CLIENT;
    user.onboardingCompleted = true;
    user.phone = normalizedPhone;

    try {
      const saved = await this.userRepository.save(user);
      return this.buildAuthResponse(saved);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const detail = (err as unknown as Record<string, unknown>).detail as string | undefined;
        if (detail?.includes('phone')) {
          throw new ConflictException(ErrorCode.PHONE_ALREADY_REGISTERED);
        }
        if (detail?.includes('email')) {
          throw new ConflictException(ErrorCode.EMAIL_ALREADY_REGISTERED);
        }
      }
      throw err;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
    }

    await this.userRepository.update(user.id, { lastLoginAt: new Date() });
    return this.buildAuthResponse(user);
  }

  async validateUser(payload: AuthenticatedUser): Promise<User | null> {
    return this.userRepository.findById(payload.id);
  }

  async upgradeToExpert(authenticatedUser: AuthenticatedUser): Promise<AuthResponseDto> {
    const user = await this.userRepository.findById(authenticatedUser.id);
    if (!user) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    if (user.role === UserRole.EXPERT) {
      throw new BadRequestException(ErrorCode.ALREADY_AN_EXPERT);
    }

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException(ErrorCode.ADMINS_CANNOT_CHANGE_ROLE);
    }

    await this.userRepository.update(user.id, {
      role: UserRole.EXPERT,
      onboardingCompleted: false,
    });

    const updated = await this.userRepository.findById(user.id);
    if (!updated) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    return this.buildAuthResponse(updated);
  }

  async revertToClient(authenticatedUser: AuthenticatedUser): Promise<AuthResponseDto> {
    const user = await this.userRepository.findById(authenticatedUser.id);
    if (!user) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException(ErrorCode.ADMINS_CANNOT_CHANGE_ROLE);
    }

    if (user.role === UserRole.EXPERT && user.onboardingCompleted) {
      throw new BadRequestException(ErrorCode.CANNOT_REVERT_AFTER_ONBOARDING);
    }

    // Delete incomplete expert profile to free up reserved slug
    const profile = await this.profileRepository.findByUserId(user.id);
    if (user.role === UserRole.CLIENT && !profile) {
      throw new BadRequestException(ErrorCode.NO_DRAFT_PROFILE_TO_ABANDON);
    }
    if (profile && !profile.onboardingCompleted) {
      await this.profileRepository.delete(profile.id);
    }

    await this.userRepository.update(user.id, {
      role: UserRole.CLIENT,
      onboardingCompleted: true,
    });

    const updated = await this.userRepository.findById(user.id);
    if (!updated) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    return this.buildAuthResponse(updated);
  }

  async getUserProfile(authenticatedUser: AuthenticatedUser): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(authenticatedUser.id);
    if (!user) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    return new UserProfileDto({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      onboardingCompleted: user.onboardingCompleted,
    });
  }

  private buildAuthResponse(user: User): AuthResponseDto {
    const payload: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const profile = new UserProfileDto({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      onboardingCompleted: user.onboardingCompleted,
    });

    return new AuthResponseDto(accessToken, profile);
  }
}
