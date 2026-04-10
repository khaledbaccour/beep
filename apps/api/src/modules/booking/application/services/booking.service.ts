import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BookingStatus, UserRole, ErrorCode } from '@beep/shared';
import { Booking } from '../../domain/entities/booking.entity';
import {
  IBookingRepository,
  BOOKING_REPOSITORY,
} from '../../domain/repositories/booking.repository.interface';
import {
  IExpertProfileRepository,
  EXPERT_PROFILE_REPOSITORY,
} from '../../../expert-profile/domain/repositories/expert-profile.repository.interface';
import {
  IPaymentGateway,
  PAYMENT_GATEWAY,
} from '../../../payment/domain/ports/payment-gateway.interface';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { ConfirmPaymentDto } from '../dtos/confirm-payment.dto';
import { CancelBookingDto } from '../dtos/cancel-booking.dto';
import { BookingResponseDto } from '../dtos/booking-response.dto';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { v4 as uuidv4 } from 'uuid';
import { BookingEmailService } from './booking-email.service';
import {
  BOOKING_REMINDER_QUEUE,
  BookingReminderJobName,
} from '../../domain/constants/queue.constants';
import { BookingReminderJobData } from '../../domain/interfaces/booking-reminder-job.interface';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: IBookingRepository,
    @Inject(EXPERT_PROFILE_REPOSITORY)
    private readonly profileRepo: IExpertProfileRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
    private readonly bookingEmailService: BookingEmailService,
    @InjectQueue(BOOKING_REMINDER_QUEUE)
    private readonly reminderQueue: Queue<BookingReminderJobData>,
  ) {}

  /**
   * Step 1: Create a booking in PENDING_PAYMENT status.
   * The frontend then opens the Gammal Tech payment popup.
   */
  async createBooking(
    currentUser: AuthenticatedUser,
    dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const profile = await this.profileRepo.findById(dto.expertProfileId);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_NOT_FOUND);
    }

    if (profile.userId === currentUser.id) {
      throw new BadRequestException(ErrorCode.CANNOT_BOOK_YOURSELF);
    }

    const startTime = new Date(dto.scheduledStartTime);
    if (startTime <= new Date()) {
      throw new BadRequestException(ErrorCode.CANNOT_BOOK_IN_PAST);
    }

    let durationMinutes: number;
    let priceCents: number;
    let sessionOptionId: string | undefined;

    if (dto.sessionOptionId) {
      const sessionOption = (profile.sessionOptions ?? []).find(
        (opt) => opt.id === dto.sessionOptionId && opt.isActive,
      );
      if (!sessionOption) {
        throw new BadRequestException('Invalid or inactive session option');
      }
      durationMinutes = sessionOption.durationMinutes;
      priceCents = sessionOption.priceCents;
      sessionOptionId = sessionOption.id;
    } else {
      durationMinutes = profile.sessionDurationMinutes;
      priceCents = profile.sessionPriceCents ?? 0;
    }

    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    const conflict = await this.bookingRepo.findConflicting(
      profile.id,
      startTime,
      endTime,
    );
    if (conflict) {
      throw new ConflictException(ErrorCode.TIME_SLOT_ALREADY_BOOKED);
    }

    const booking = new Booking();
    booking.clientId = currentUser.id;
    booking.expertProfileId = profile.id;
    booking.scheduledStartTime = startTime;
    booking.scheduledEndTime = endTime;
    booking.amountCents = priceCents;
    booking.durationMinutes = durationMinutes;
    booking.sessionOptionId = sessionOptionId;
    booking.status = BookingStatus.PENDING_PAYMENT;
    booking.sessionRoomId = uuidv4();

    const saved = await this.bookingRepo.save(booking);
    return this.toResponseDto(saved);
  }

  /**
   * Step 2: Frontend calls this after Gammal Tech SDK payment popup completes.
   * Records the payment and transitions booking to CONFIRMED.
   */
  async confirmPayment(
    currentUser: AuthenticatedUser,
    bookingId: string,
    dto: ConfirmPaymentDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(ErrorCode.BOOKING_NOT_FOUND);
    }

    if (booking.clientId !== currentUser.id) {
      throw new ForbiddenException(ErrorCode.ONLY_CLIENT_CAN_CONFIRM_PAYMENT);
    }

    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException(ErrorCode.BOOKING_NOT_AWAITING_PAYMENT);
    }

    const result = await this.paymentGateway.recordPayment({
      bookingId: booking.id,
      transactionId: dto.transactionId,
      amountCents: booking.amountCents,
      currency: 'EUR',
      idempotencyKey: `booking-${booking.id}`,
    });

    if (!result.success) {
      throw new BadRequestException(ErrorCode.PAYMENT_RECORDING_FAILED);
    }

    booking.paymentId = dto.transactionId;
    booking.confirm();

    const saved = await this.bookingRepo.save(booking);

    // Load full relations for emails (findById loads client + expertProfile.user)
    const fullBooking = await this.bookingRepo.findById(saved.id);
    if (fullBooking) {
      void this.sendConfirmationEmails(fullBooking);
      void this.scheduleReminders(fullBooking);
    }

    return this.toResponseDto(saved);
  }

  private async sendConfirmationEmails(booking: Booking): Promise<void> {
    try {
      await this.bookingEmailService.sendBookingConfirmedToClient(booking);
      await this.bookingEmailService.sendBookingConfirmedToExpert(booking);
    } catch (err) {
      this.logger.error('Failed to send booking confirmation emails', err);
    }
  }

  private async scheduleReminders(booking: Booking): Promise<void> {
    try {
      const startMs = booking.scheduledStartTime.getTime();
      const nowMs = Date.now();

      const reminders: Array<{
        name: BookingReminderJobName;
        hoursUntil: 24 | 1;
        recipientType: 'client' | 'expert';
      }> = [
        { name: BookingReminderJobName.REMIND_CLIENT, hoursUntil: 24, recipientType: 'client' },
        { name: BookingReminderJobName.REMIND_EXPERT, hoursUntil: 24, recipientType: 'expert' },
        { name: BookingReminderJobName.REMIND_CLIENT, hoursUntil: 1, recipientType: 'client' },
        { name: BookingReminderJobName.REMIND_EXPERT, hoursUntil: 1, recipientType: 'expert' },
      ];

      for (const reminder of reminders) {
        const fireAtMs = startMs - reminder.hoursUntil * 60 * 60 * 1000;
        const delay = fireAtMs - nowMs;
        if (delay <= 0) continue;

        await this.reminderQueue.add(
          reminder.name,
          {
            bookingId: booking.id,
            hoursUntil: reminder.hoursUntil,
            recipientType: reminder.recipientType,
          },
          {
            delay,
            jobId: `reminder-${booking.id}-${reminder.recipientType}-${reminder.hoursUntil}h`,
            removeOnComplete: true,
            removeOnFail: false,
          },
        );
      }

      this.logger.log(`Scheduled reminders for booking ${booking.id}`);
    } catch (err) {
      this.logger.error('Failed to schedule reminders', err);
    }
  }

  async cancelBooking(
    currentUser: AuthenticatedUser,
    bookingId: string,
    dto: CancelBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(ErrorCode.BOOKING_NOT_FOUND);
    }

    const isClient = booking.clientId === currentUser.id;
    const isExpert = booking.expertProfile?.userId === currentUser.id;

    if (!isClient && !isExpert && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException(ErrorCode.FORBIDDEN);
    }

    if (isClient) {
      booking.cancelByClient(dto.reason);
    } else {
      booking.cancelByExpert(dto.reason);
    }

    if (booking.refundAmountCents > 0 && booking.paymentId) {
      await this.paymentGateway.requestRefund({
        transactionId: booking.paymentId,
        amountCents: booking.refundAmountCents,
        reason: dto.reason,
        idempotencyKey: `refund-${booking.id}-${Date.now()}`,
      });
    }

    const saved = await this.bookingRepo.save(booking);
    return this.toResponseDto(saved);
  }

  async getBooking(
    currentUser: AuthenticatedUser,
    bookingId: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(ErrorCode.BOOKING_NOT_FOUND);
    }

    const isClient = booking.clientId === currentUser.id;
    const isExpert = booking.expertProfile?.userId === currentUser.id;
    if (!isClient && !isExpert && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException(ErrorCode.FORBIDDEN);
    }

    return this.toResponseDto(booking);
  }

  async getMyBookings(
    currentUser: AuthenticatedUser,
  ): Promise<BookingResponseDto[]> {
    const bookings = await this.bookingRepo.findByClientId(currentUser.id);
    return bookings.map((b) => this.toResponseDto(b));
  }

  async getExpertBookings(
    currentUser: AuthenticatedUser,
  ): Promise<BookingResponseDto[]> {
    const profile = await this.profileRepo.findByUserId(currentUser.id);
    if (!profile) {
      throw new NotFoundException(ErrorCode.EXPERT_PROFILE_NOT_FOUND);
    }
    const bookings = await this.bookingRepo.findByExpertProfileId(profile.id);
    return bookings.map((b) => this.toResponseDto(b));
  }

  private toResponseDto(booking: Booking): BookingResponseDto {
    return new BookingResponseDto({
      id: booking.id,
      clientId: booking.clientId,
      expertProfileId: booking.expertProfileId,
      expertName: booking.expertProfile?.user?.fullName ?? 'Unknown',
      clientName: booking.client?.fullName ?? 'Unknown',
      scheduledStartTime: booking.scheduledStartTime,
      scheduledEndTime: booking.scheduledEndTime,
      status: booking.status,
      amountCents: booking.amountCents,
      refundAmountCents: booking.refundAmountCents,
      refundEligibility: booking.getRefundEligibility(),
      sessionRoomId: booking.sessionRoomId,
      durationMinutes: booking.durationMinutes,
    });
  }
}
