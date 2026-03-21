import { AvailabilitySchedule } from '../entities/availability-schedule.entity';
import { BlackoutDate } from '../entities/blackout-date.entity';
import { WeeklyAvailabilitySlot } from '../entities/weekly-availability-slot.entity';

export const AVAILABILITY_REPOSITORY = Symbol('AVAILABILITY_REPOSITORY');

export interface IAvailabilityRepository {
  findSchedulesByExpertId(expertProfileId: string): Promise<AvailabilitySchedule[]>;
  saveSchedule(schedule: AvailabilitySchedule): Promise<AvailabilitySchedule>;
  saveSchedules(schedules: AvailabilitySchedule[]): Promise<AvailabilitySchedule[]>;
  deleteSchedulesByExpertId(expertProfileId: string): Promise<void>;
  findBlackoutDates(expertProfileId: string, from: Date, to: Date): Promise<BlackoutDate[]>;
  saveBlackoutDate(blackout: BlackoutDate): Promise<BlackoutDate>;
  deleteBlackoutDate(id: string): Promise<void>;

  // Weekly date-specific slots
  findWeekSlotsByExpertAndDates(expertProfileId: string, dates: string[]): Promise<WeeklyAvailabilitySlot[]>;
  findWeekSlotsByDate(expertProfileId: string, date: string): Promise<WeeklyAvailabilitySlot[]>;
  saveWeekSlots(slots: WeeklyAvailabilitySlot[]): Promise<WeeklyAvailabilitySlot[]>;
  deleteWeekSlotsByDates(expertProfileId: string, dates: string[]): Promise<void>;
  findExpertsWithoutWeekSlots(dates: string[]): Promise<{ id: string; userId: string }[]>;
}
