import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BookingStatus } from '@beep/shared';
import {
  BOOKING_REMINDER_QUEUE,
  BookingReminderJobName,
} from '../../domain/constants/queue.constants';
import { BookingReminderJobData } from '../../domain/interfaces/booking-reminder-job.interface';
import {
  IBookingRepository,
  BOOKING_REPOSITORY,
} from '../../domain/repositories/booking.repository.interface';
import { BookingEmailService } from '../../application/services/booking-email.service';

@Processor(BOOKING_REMINDER_QUEUE)
export class BookingReminderProcessor {
  private readonly logger = new Logger(BookingReminderProcessor.name);

  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: IBookingRepository,
    private readonly bookingEmailService: BookingEmailService,
  ) {}

  @Process(BookingReminderJobName.REMIND_CLIENT)
  async handleClientReminder(job: Job<BookingReminderJobData>): Promise<void> {
    this.logger.log(`Processing client reminder for booking ${job.data.bookingId}`);
    const booking = await this.bookingRepo.findById(job.data.bookingId);

    if (!booking || booking.status !== BookingStatus.CONFIRMED) {
      this.logger.log(`Skipping reminder - booking not found or not confirmed`);
      return;
    }

    await this.bookingEmailService.sendReminderToClient(booking, job.data.hoursUntil);
  }

  @Process(BookingReminderJobName.REMIND_EXPERT)
  async handleExpertReminder(job: Job<BookingReminderJobData>): Promise<void> {
    this.logger.log(`Processing expert reminder for booking ${job.data.bookingId}`);
    const booking = await this.bookingRepo.findById(job.data.bookingId);

    if (!booking || booking.status !== BookingStatus.CONFIRMED) {
      this.logger.log(`Skipping reminder - booking not found or not confirmed`);
      return;
    }

    await this.bookingEmailService.sendReminderToExpert(booking, job.data.hoursUntil);
  }
}
