import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from './domain/repositories/booking.repository.interface';
import { TypeOrmBookingRepository } from './infrastructure/repositories/typeorm-booking.repository';
import { BookingService } from './application/services/booking.service';
import { BookingController } from './infrastructure/controllers/booking.controller';
import { ExpertProfileModule } from '../expert-profile/expert-profile.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ExpertProfileModule,
    PaymentModule,
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    {
      provide: BOOKING_REPOSITORY,
      useClass: TypeOrmBookingRepository,
    },
  ],
  exports: [BookingService, BOOKING_REPOSITORY],
})
export class BookingModule {}
