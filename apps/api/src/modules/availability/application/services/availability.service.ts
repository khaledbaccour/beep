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
import { DayOfWeek } from '@beep/shared';
import { SetAvailabilityDto } from '../dtos/set-availability.dto';
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

  async setAvailability(
    currentUser: AuthenticatedUser,
    dto: SetAvailabilityDto,
  ): Promise<AvailabilitySchedule[]> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      throw new NotFoundException('Expert profile not found');
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

  async getAvailableSlots(
    expertProfileId: string,
    date: Date,
  ): Promise<AvailableSlot[]> {
    const profile = await this.profileRepo.findById(expertProfileId);
    if (!profile) {
      throw new NotFoundException('Expert not found');
    }

    const dayNames: DayOfWeek[] = [DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY];
    const dayOfWeek = dayNames[date.getUTCDay()];

    const schedules = await this.availabilityRepo.findSchedulesByExpertId(expertProfileId);
    const daySchedules = schedules.filter((s) => s.dayOfWeek === dayOfWeek);

    const blackouts = await this.availabilityRepo.findBlackoutDates(
      expertProfileId,
      date,
      date,
    );
    if (blackouts.length > 0) {
      return [];
    }

    const slots: AvailableSlot[] = [];
    const durationMs = profile.sessionDurationMinutes * 60 * 1000;

    for (const schedule of daySchedules) {
      const [startHour, startMin] = schedule.startTime.split(':').map(Number);
      const [endHour, endMin] = schedule.endTime.split(':').map(Number);

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

  /**
   * Returns the list of dates within [from, to] that have at least one available slot.
   * Used by the frontend DatePicker to visually disable days with no availability.
   */
  async getAvailableDates(
    expertProfileId: string,
    from: Date,
    to: Date,
  ): Promise<string[]> {
    const profile = await this.profileRepo.findById(expertProfileId);
    if (!profile) {
      throw new NotFoundException('Expert not found');
    }

    const allSchedules = await this.availabilityRepo.findSchedulesByExpertId(expertProfileId);
    const schedules = allSchedules.filter((s) => s.isActive);
    if (schedules.length === 0) return [];

    const blackouts = await this.availabilityRepo.findBlackoutDates(expertProfileId, from, to);
    const blackoutSet = new Set(blackouts.map((b) => b.date));

    const dayNames: DayOfWeek[] = [DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY];
    const scheduledDays = new Set(schedules.map((s) => s.dayOfWeek));

    const availableDates: string[] = [];
    const current = new Date(from);

    while (current <= to) {
      const dateStr = current.toISOString().split('T')[0];
      const dayOfWeek = dayNames[current.getUTCDay()];

      if (scheduledDays.has(dayOfWeek) && !blackoutSet.has(dateStr)) {
        availableDates.push(dateStr);
      }

      current.setUTCDate(current.getUTCDate() + 1);
    }

    return availableDates;
  }

  async getSchedules(expertProfileId: string): Promise<AvailabilitySchedule[]> {
    return this.availabilityRepo.findSchedulesByExpertId(expertProfileId);
  }
}
