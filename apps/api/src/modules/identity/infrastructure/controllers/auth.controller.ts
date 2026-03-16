import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { AuthResponseDto, UserProfileDto } from '../../application/dtos/auth-response.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../domain/interfaces/authenticated-user.interface';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(dto);
    return ApiResponseDto.ok(result);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.login(dto);
    return ApiResponseDto.ok(result);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponseDto<UserProfileDto>> {
    const fullUser = await this.authService.validateUser(user);
    if (!fullUser) {
      throw new Error('User not found');
    }
    const profile = new UserProfileDto({
      id: fullUser.id,
      email: fullUser.email,
      firstName: fullUser.firstName,
      lastName: fullUser.lastName,
      role: fullUser.role,
      avatarUrl: fullUser.avatarUrl,
    });
    return ApiResponseDto.ok(profile);
  }
}
