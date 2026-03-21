import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AvailabilityService, AvailableSlot } from '../../application/services/availability.service';
import { AvailabilityReminderService } from '../../application/services/availability-reminder.service';
import { SetAvailabilityDto } from '../../application/dtos/set-availability.dto';
import { SetWeekAvailabilityDto } from '../../application/dtos/set-week-availability.dto';
import { SetRecurrenceDto } from '../../application/dtos/set-recurrence.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { UserRole, ErrorCode } from '@beep/shared';
import { ApiResponseDto } from '../../../../common/application/dtos/api-response.dto';
import { AvailabilitySchedule } from '../../domain/entities/availability-schedule.entity';
import { WeeklyAvailabilitySlot } from '../../domain/entities/weekly-availability-slot.entity';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly reminderService: AvailabilityReminderService,
  ) {}

  /** Save recurring weekly template */
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

  /** Save date-specific week slots */
  @Put('week')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EXPERT)
  @ApiBearerAuth()
  async setWeekAvailability(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetWeekAvailabilityDto,
  ): Promise<ApiResponseDto<WeeklyAvailabilitySlot[]>> {
    const result = await this.availabilityService.setWeekAvailability(user, dto);
    return ApiResponseDto.ok(result);
  }

  /** Update recurrence settings */
  @Put('recurrence')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EXPERT)
  @ApiBearerAuth()
  async setRecurrence(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetRecurrenceDto,
  ): Promise<ApiResponseDto<{ isRecurring: boolean; recurringUntil: string | null }>> {
    const result = await this.availabilityService.setRecurrence(user, dto);
    return ApiResponseDto.ok(result);
  }

  /** Get date-specific slots for a week */
  @Get(':expertProfileId/week-slots')
  async getWeekSlots(
    @Param('expertProfileId') expertProfileId: string,
    @Query('weekStart') weekStart: string,
  ): Promise<ApiResponseDto<WeeklyAvailabilitySlot[]>> {
    if (!weekStart) {
      throw new BadRequestException('weekStart query parameter is required');
    }
    const slots = await this.availabilityService.getWeekSlots(expertProfileId, weekStart);
    return ApiResponseDto.ok(slots);
  }

  /** Get recurrence settings */
  @Get(':expertProfileId/recurrence')
  async getRecurrence(
    @Param('expertProfileId') expertProfileId: string,
  ): Promise<ApiResponseDto<{ isRecurring: boolean; recurringUntil: string | null }>> {
    const result = await this.availabilityService.getRecurrence(expertProfileId);
    return ApiResponseDto.ok(result);
  }

  /** Trigger weekly availability reminders (called by cron-job.org) */
  @Post('send-reminders')
  async sendReminders(): Promise<ApiResponseDto<{ sent: number }>> {
    const sent = await this.reminderService.sendWeeklyReminders();
    return ApiResponseDto.ok({ sent });
  }

  @Get(':expertProfileId/slots')
  async getSlots(
    @Param('expertProfileId') expertProfileId: string,
    @Query('date') dateStr: string,
    @Query('duration') durationStr?: string,
  ): Promise<ApiResponseDto<AvailableSlot[]>> {
    const date = new Date(dateStr);
    const duration = durationStr ? parseInt(durationStr, 10) : undefined;
    const slots = await this.availabilityService.getAvailableSlots(expertProfileId, date, duration);
    return ApiResponseDto.ok(slots);
  }

  @Get(':expertProfileId/available-dates')
  async getAvailableDates(
    @Param('expertProfileId') expertProfileId: string,
    @Query('from') fromStr: string,
    @Query('to') toStr: string,
  ): Promise<ApiResponseDto<string[]>> {
    const from = new Date(fromStr);
    const to = new Date(toStr);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestException(ErrorCode.INVALID_DATE_PARAMETERS);
    }
    const diffDays = (to.getTime() - from.getTime()) / 86_400_000;
    if (diffDays < 0 || diffDays > 31) {
      throw new BadRequestException(ErrorCode.DATE_RANGE_TOO_LARGE);
    }
    const dates = await this.availabilityService.getAvailableDates(expertProfileId, from, to);
    return ApiResponseDto.ok(dates);
  }

  @Get(':expertProfileId/schedules')
  async getSchedules(
    @Param('expertProfileId') expertProfileId: string,
  ): Promise<ApiResponseDto<AvailabilitySchedule[]>> {
    const schedules = await this.availabilityService.getSchedules(expertProfileId);
    return ApiResponseDto.ok(schedules);
  }
}
