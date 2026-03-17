import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { AuthResponseDto, UserProfileDto } from '../../application/dtos/auth-response.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../domain/interfaces/authenticated-user.interface';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponseDto<UserProfileDto>> {
    const profile = await this.authService.getUserProfile(user);
    return ApiResponseDto.ok(profile);
  }

  @Post('upgrade-to-expert')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async upgradeToExpert(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.upgradeToExpert(user);
    return ApiResponseDto.ok(result);
  }
}
