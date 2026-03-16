import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AvailabilitySchedule } from '../../domain/entities/availability-schedule.entity';
import { BlackoutDate } from '../../domain/entities/blackout-date.entity';
import { IAvailabilityRepository } from '../../domain/repositories/availability.repository.interface';

@Injectable()
export class TypeOrmAvailabilityRepository implements IAvailabilityRepository {
  constructor(
    @InjectRepository(AvailabilitySchedule)
    private readonly scheduleRepo: Repository<AvailabilitySchedule>,
    @InjectRepository(BlackoutDate)
    private readonly blackoutRepo: Repository<BlackoutDate>,
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
}
