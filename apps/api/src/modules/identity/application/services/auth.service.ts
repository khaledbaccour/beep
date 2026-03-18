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
import { UserRole } from '@beep/shared';

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
      throw new ConflictException('Email already registered');
    }

    const normalizedPhone = dto.phone?.replace(/\s+/g, '') || undefined;

    if (normalizedPhone) {
      const existingPhone = await this.userRepository.findByPhone(normalizedPhone);
      if (existingPhone) {
        throw new ConflictException('Phone number already registered');
      }
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
        const detail = (err as Record<string, unknown>).detail as string | undefined;
        if (detail?.includes('phone')) {
          throw new ConflictException('Phone number already registered');
        }
        if (detail?.includes('email')) {
          throw new ConflictException('Email already registered');
        }
      }
      throw err;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.EXPERT) {
      throw new BadRequestException('Already an expert');
    }

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins cannot change their own role');
    }

    await this.userRepository.update(user.id, {
      role: UserRole.EXPERT,
      onboardingCompleted: false,
    });

    const updated = await this.userRepository.findById(user.id);
    if (!updated) {
      throw new NotFoundException('User not found after update');
    }

    return this.buildAuthResponse(updated);
  }

  async revertToClient(authenticatedUser: AuthenticatedUser): Promise<AuthResponseDto> {
    const user = await this.userRepository.findById(authenticatedUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.EXPERT) {
      throw new BadRequestException('Only experts can revert to client');
    }

    if (user.onboardingCompleted) {
      throw new BadRequestException('Cannot revert after completing onboarding');
    }

    // Delete incomplete expert profile to free up reserved slug
    const profile = await this.profileRepository.findByUserId(user.id);
    if (profile && !profile.onboardingCompleted) {
      await this.profileRepository.delete(profile.id);
    }

    await this.userRepository.update(user.id, {
      role: UserRole.CLIENT,
      onboardingCompleted: true,
    });

    const updated = await this.userRepository.findById(user.id);
    if (!updated) {
      throw new NotFoundException('User not found after update');
    }

    return this.buildAuthResponse(updated);
  }

  async getUserProfile(authenticatedUser: AuthenticatedUser): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(authenticatedUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
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
