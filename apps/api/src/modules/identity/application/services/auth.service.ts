import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
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
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = new User();
    user.email = dto.email;
    user.passwordHash = await bcrypt.hash(dto.password, 12);
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.role = UserRole.CLIENT;
    user.onboardingCompleted = true;
    user.phone = dto.phone;

    const saved = await this.userRepository.save(user);
    return this.buildAuthResponse(saved);
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

    if (user.role !== UserRole.CLIENT) {
      throw new BadRequestException('Only clients can upgrade to expert');
    }

    user.role = UserRole.EXPERT;
    user.onboardingCompleted = false;

    await this.userRepository.update(user.id, {
      role: UserRole.EXPERT,
      onboardingCompleted: false,
    });

    return this.buildAuthResponse(user);
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
