import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IAvailabilityRepository,
  AVAILABILITY_REPOSITORY,
} from '../../domain/repositories/availability.repository.interface';
import {
  IExpertProfileRepository,
  EXPERT_PROFILE_REPOSITORY,
} from '../../../expert-profile/domain/repositories/expert-profile.repository.interface';
import { AvailabilitySchedule } from '../../domain/entities/availability-schedule.entity';
import { WeeklyAvailabilitySlot } from '../../domain/entities/weekly-availability-slot.entity';
import { DayOfWeek, ErrorCode } from '@beep/shared';
import { SetAvailabilityDto } from '../dtos/set-availability.dto';
import { SetWeekAvailabilityDto } from '../dtos/set-week-availability.dto';
import { SetRecurrenceDto } from '../dtos/set-recurrence.dto';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';

export interface AvailableSlot {
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class AvailabilityService {
  constructor(
    @Inject(AVAILABILITY_REPOSITORY)
    private readonly availabilityRepo: IAvailabilityRepository,
    @Inject(EXPERT_PROFILE_REPOSITORY)
    private readonly profileRepo: IExpertProfileRepository,
  ) {}

  /** Save recurring weekly template */
  async setAvailability(
    currentUser: AuthenticatedUser,
    dto: SetAvailabilityDto,
  ): Promise<AvailabilitySchedule[]> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_PROFILE_NOT_FOUND);
    }

    await this.availabilityRepo.deleteSchedulesByExpertId(profile.id);

    const schedules = dto.slots.map((slot) => {
      const schedule = new AvailabilitySchedule();
      schedule.expertProfileId = profile.id;
      schedule.dayOfWeek = slot.dayOfWeek;
      schedule.startTime = slot.startTime;
      schedule.endTime = slot.endTime;
      schedule.isActive = slot.isActive ?? true;
      return schedule;
    });

    return this.availabilityRepo.saveSchedules(schedules);
  }

  /** Save date-specific week slots */
  async setWeekAvailability(
    currentUser: AuthenticatedUser,
    dto: SetWeekAvailabilityDto,
  ): Promise<WeeklyAvailabilitySlot[]> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_PROFILE_NOT_FOUND);
    }

    const dates = [...new Set(dto.slots.map((s) => s.date))];
    await this.availabilityRepo.deleteWeekSlotsByDates(profile.id, dates);

    if (dto.slots.length === 0) return [];

    const slots = dto.slots.map((s) => {
      const slot = new WeeklyAvailabilitySlot();
      slot.expertProfileId = profile.id;
      slot.date = s.date;
      slot.startTime = s.startTime.slice(0, 5);
      slot.endTime = s.endTime.slice(0, 5);
      return slot;
    });

    return this.availabilityRepo.saveWeekSlots(slots);
  }

  /** Update recurring settings on expert profile */
  async setRecurrence(
    currentUser: AuthenticatedUser,
    dto: SetRecurrenceDto,
  ): Promise<{ isRecurring: boolean; recurringUntil: string | null }> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_PROFILE_NOT_FOUND);
    }

    profile.availabilityRecurring = dto.isRecurring;
    profile.availabilityRecurringUntil = dto.recurringUntil ?? null;
    await this.profileRepo.save(profile);

    return {
      isRecurring: profile.availabilityRecurring,
      recurringUntil: profile.availabilityRecurringUntil,
    };
  }

  /** Get date-specific slots for a week */
  async getWeekSlots(
    expertProfileId: string,
    weekStart: string,
  ): Promise<WeeklyAvailabilitySlot[]> {
    const dates = this.getWeekDates(weekStart);
    return this.availabilityRepo.findWeekSlotsByExpertAndDates(expertProfileId, dates);
  }

  /**
   * Get available booking slots for a specific date.
   * Priority: date-specific slots > recurring template (if enabled & in range)
   */
  async getAvailableSlots(
    expertProfileId: string,
    date: Date,
    durationMinutes?: number,
  ): Promise<AvailableSlot[]> {
    const profile = await this.profileRepo.findById(expertProfileId);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_NOT_FOUND);
    }

    const slotDuration = durationMinutes ?? profile.sessionDurationMinutes;
    const dateStr = date.toISOString().split('T')[0];

    const blackouts = await this.availabilityRepo.findBlackoutDates(expertProfileId, date, date);
    if (blackouts.length > 0) return [];

    // 1. Check date-specific slots
    const weekSlots = await this.availabilityRepo.findWeekSlotsByDate(expertProfileId, dateStr);
    if (weekSlots.length > 0) {
      return this.generateSlotsFromTimeRanges(
        weekSlots.map((s) => ({ startTime: s.startTime, endTime: s.endTime })),
        date,
        slotDuration,
      );
    }

    // 2. Fall back to recurring template if enabled
    if (profile.availabilityRecurring) {
      if (profile.availabilityRecurringUntil) {
        const untilDate = new Date(profile.availabilityRecurringUntil + 'T23:59:59Z');
        if (date > untilDate) return [];
      }

      const dayNames: DayOfWeek[] = [
        DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY,
      ];
      const dayOfWeek = dayNames[date.getUTCDay()];

      const schedules = await this.availabilityRepo.findSchedulesByExpertId(expertProfileId);
      const daySchedules = schedules.filter((s) => s.dayOfWeek === dayOfWeek);

      return this.generateSlotsFromTimeRanges(
        daySchedules.map((s) => ({ startTime: s.startTime, endTime: s.endTime })),
        date,
        slotDuration,
      );
    }

    return [];
  }

  /**
   * Returns dates within [from, to] that have at least one available slot.
   */
  async getAvailableDates(
    expertProfileId: string,
    from: Date,
    to: Date,
  ): Promise<string[]> {
    const profile = await this.profileRepo.findById(expertProfileId);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_NOT_FOUND);
    }

    const blackouts = await this.availabilityRepo.findBlackoutDates(expertProfileId, from, to);
    const blackoutSet = new Set(blackouts.map((b) => b.date));

    const allDates: string[] = [];
    const current = new Date(from);
    while (current <= to) {
      allDates.push(current.toISOString().split('T')[0]);
      current.setUTCDate(current.getUTCDate() + 1);
    }

    const weekSlots = await this.availabilityRepo.findWeekSlotsByExpertAndDates(expertProfileId, allDates);
    const datesWithSlots = new Set(weekSlots.map((s) => s.date));

    let scheduledDays = new Set<DayOfWeek>();
    if (profile.availabilityRecurring) {
      const schedules = await this.availabilityRepo.findSchedulesByExpertId(expertProfileId);
      scheduledDays = new Set(schedules.filter((s) => s.isActive).map((s) => s.dayOfWeek));
    }

    const dayNames: DayOfWeek[] = [
      DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY,
    ];

    const availableDates: string[] = [];

    for (const dateStr of allDates) {
      if (blackoutSet.has(dateStr)) continue;

      if (datesWithSlots.has(dateStr)) {
        availableDates.push(dateStr);
        continue;
      }

      if (profile.availabilityRecurring) {
        if (profile.availabilityRecurringUntil) {
          const untilDate = new Date(profile.availabilityRecurringUntil + 'T23:59:59Z');
          const d = new Date(dateStr + 'T00:00:00Z');
          if (d > untilDate) continue;
        }

        const d = new Date(dateStr + 'T00:00:00Z');
        const dayOfWeek = dayNames[d.getUTCDay()];
        if (scheduledDays.has(dayOfWeek)) {
          availableDates.push(dateStr);
        }
      }
    }

    return availableDates;
  }

  async getSchedules(expertProfileId: string): Promise<AvailabilitySchedule[]> {
    return this.availabilityRepo.findSchedulesByExpertId(expertProfileId);
  }

  async getRecurrence(expertProfileId: string): Promise<{ isRecurring: boolean; recurringUntil: string | null }> {
    const profile = await this.profileRepo.findById(expertProfileId);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_NOT_FOUND);
    }
    return {
      isRecurring: profile.availabilityRecurring,
      recurringUntil: profile.availabilityRecurringUntil,
    };
  }

  private generateSlotsFromTimeRanges(
    ranges: { startTime: string; endTime: string }[],
    date: Date,
    slotDuration: number,
  ): AvailableSlot[] {
    const slots: AvailableSlot[] = [];
    const durationMs = slotDuration * 60 * 1000;

    for (const range of ranges) {
      const [startHour, startMin] = range.startTime.split(':').map(Number);
      const [endHour, endMin] = range.endTime.split(':').map(Number);

      const slotStart = new Date(date);
      slotStart.setUTCHours(startHour, startMin, 0, 0);

      const scheduleEnd = new Date(date);
      scheduleEnd.setUTCHours(endHour, endMin, 0, 0);

      let current = slotStart.getTime();
      while (current + durationMs <= scheduleEnd.getTime()) {
        slots.push({
          startTime: new Date(current),
          endTime: new Date(current + durationMs),
        });
        current += durationMs;
      }
    }

    return slots;
  }

  private getWeekDates(weekStart: string): string[] {
    const start = new Date(weekStart + 'T00:00:00Z');
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }
}
