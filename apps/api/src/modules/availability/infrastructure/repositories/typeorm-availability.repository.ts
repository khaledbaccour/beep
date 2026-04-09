import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { AvailabilitySchedule } from '../../domain/entities/availability-schedule.entity';
import { BlackoutDate } from '../../domain/entities/blackout-date.entity';
import { WeeklyAvailabilitySlot } from '../../domain/entities/weekly-availability-slot.entity';
import { IAvailabilityRepository } from '../../domain/repositories/availability.repository.interface';

@Injectable()
export class TypeOrmAvailabilityRepository implements IAvailabilityRepository {
  constructor(
    @InjectRepository(AvailabilitySchedule)
    private readonly scheduleRepo: Repository<AvailabilitySchedule>,
    @InjectRepository(BlackoutDate)
    private readonly blackoutRepo: Repository<BlackoutDate>,
    @InjectRepository(WeeklyAvailabilitySlot)
    private readonly weekSlotRepo: Repository<WeeklyAvailabilitySlot>,
  ) {}

  async findSchedulesByExpertId(expertProfileId: string): Promise<AvailabilitySchedule[]> {
    return this.scheduleRepo.find({ where: { expertProfileId, isActive: true } });
  }

  async saveSchedule(schedule: AvailabilitySchedule): Promise<AvailabilitySchedule> {
    return this.scheduleRepo.save(schedule);
  }

  async saveSchedules(schedules: AvailabilitySchedule[]): Promise<AvailabilitySchedule[]> {
    return this.scheduleRepo.save(schedules);
  }

  async deleteSchedulesByExpertId(expertProfileId: string): Promise<void> {
    await this.scheduleRepo.delete({ expertProfileId });
  }

  async findBlackoutDates(
    expertProfileId: string,
    from: Date,
    to: Date,
  ): Promise<BlackoutDate[]> {
    return this.blackoutRepo.find({
      where: {
        expertProfileId,
        date: Between(from.toISOString().split('T')[0], to.toISOString().split('T')[0]),
      },
    });
  }

  async saveBlackoutDate(blackout: BlackoutDate): Promise<BlackoutDate> {
    return this.blackoutRepo.save(blackout);
  }

  async deleteBlackoutDate(id: string): Promise<void> {
    await this.blackoutRepo.delete(id);
  }

  // Weekly date-specific slots

  async findWeekSlotsByExpertAndDates(expertProfileId: string, dates: string[]): Promise<WeeklyAvailabilitySlot[]> {
    if (dates.length === 0) return [];
    return this.weekSlotRepo.find({
      where: { expertProfileId, date: In(dates) },
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async findWeekSlotsByDate(expertProfileId: string, date: string): Promise<WeeklyAvailabilitySlot[]> {
    return this.weekSlotRepo.find({
      where: { expertProfileId, date },
      order: { startTime: 'ASC' },
    });
  }

  async saveWeekSlots(slots: WeeklyAvailabilitySlot[]): Promise<WeeklyAvailabilitySlot[]> {
    return this.weekSlotRepo.save(slots);
  }

  async deleteWeekSlotsByDates(expertProfileId: string, dates: string[]): Promise<void> {
    if (dates.length === 0) return;
    await this.weekSlotRepo.delete({ expertProfileId, date: In(dates) });
  }

  async findExpertsWithoutWeekSlots(dates: string[]): Promise<{ id: string; userId: string }[]> {
    if (dates.length === 0) return [];

    const qb = this.weekSlotRepo.manager
      .createQueryBuilder()
      .select('ep.id', 'id')
      .addSelect('ep."userId"', 'userId')
      .from('expert_profiles', 'ep')
      .where('ep."availabilityRecurring" = false')
      .andWhere('ep."onboardingCompleted" = true')
      .andWhere((sub) => {
        const subQuery = sub.subQuery()
          .select('1')
          .from('weekly_availability_slots', 'was')
          .where('was."expertProfileId" = ep.id')
          .andWhere('was.date IN (:...dates)', { dates })
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      });

    return qb.getRawMany();
  }
}
