import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilitySchedule } from './domain/entities/availability-schedule.entity';
import { BlackoutDate } from './domain/entities/blackout-date.entity';
import { AVAILABILITY_REPOSITORY } from './domain/repositories/availability.repository.interface';
import { TypeOrmAvailabilityRepository } from './infrastructure/repositories/typeorm-availability.repository';
import { AvailabilityService } from './application/services/availability.service';
import { AvailabilityController } from './infrastructure/controllers/availability.controller';
import { ExpertProfileModule } from '../expert-profile/expert-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailabilitySchedule, BlackoutDate]),
    ExpertProfileModule,
  ],
  controllers: [AvailabilityController],
  providers: [
    AvailabilityService,
    {
      provide: AVAILABILITY_REPOSITORY,
      useClass: TypeOrmAvailabilityRepository,
    },
  ],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
