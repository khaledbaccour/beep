import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Booking } from './domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from './domain/repositories/booking.repository.interface';
import { TypeOrmBookingRepository } from './infrastructure/repositories/typeorm-booking.repository';
import { BookingService } from './application/services/booking.service';
import { BookingEmailService } from './application/services/booking-email.service';
import { BookingController } from './infrastructure/controllers/booking.controller';
import { BookingReminderProcessor } from './infrastructure/processors/booking-reminder.processor';
import { ExpertProfileModule } from '../expert-profile/expert-profile.module';
import { PaymentModule } from '../payment/payment.module';
import { NotificationModule } from '../notification/notification.module';
import { BOOKING_REMINDER_QUEUE } from './domain/constants/queue.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ExpertProfileModule,
    PaymentModule,
    NotificationModule,
    BullModule.registerQueue({ name: BOOKING_REMINDER_QUEUE }),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingEmailService,
    BookingReminderProcessor,
    {
      provide: BOOKING_REPOSITORY,
      useClass: TypeOrmBookingRepository,
    },
  ],
  exports: [BookingService, BOOKING_REPOSITORY],
})
export class BookingModule {}
