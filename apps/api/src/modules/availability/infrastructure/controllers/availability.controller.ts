import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AvailabilityService, AvailableSlot } from '../../application/services/availability.service';
import { SetAvailabilityDto } from '../../application/dtos/set-availability.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { UserRole } from '@beep/shared';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';
import { AvailabilitySchedule } from '../../domain/entities/availability-schedule.entity';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EXPERT)
  @ApiBearerAuth()
  async setAvailability(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetAvailabilityDto,
  ): Promise<ApiResponseDto<AvailabilitySchedule[]>> {
    const result = await this.availabilityService.setAvailability(user, dto);
    return ApiResponseDto.ok(result);
  }

  @Get(':expertProfileId/slots')
  async getSlots(
    @Param('expertProfileId') expertProfileId: string,
    @Query('date') dateStr: string,
  ): Promise<ApiResponseDto<AvailableSlot[]>> {
    const date = new Date(dateStr);
    const slots = await this.availabilityService.getAvailableSlots(expertProfileId, date);
    return ApiResponseDto.ok(slots);
  }

  @Get(':expertProfileId/schedules')
  async getSchedules(
    @Param('expertProfileId') expertProfileId: string,
  ): Promise<ApiResponseDto<AvailabilitySchedule[]>> {
    const schedules = await this.availabilityService.getSchedules(expertProfileId);
    return ApiResponseDto.ok(schedules);
  }
}
