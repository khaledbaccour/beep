import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { BookingStatus, UserRole } from '@beep/shared';
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
import { CancelBookingDto } from '../dtos/cancel-booking.dto';
import { BookingResponseDto } from '../dtos/booking-response.dto';
import { AuthenticatedUser } from '../../../identity/domain/interfaces/authenticated-user.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingService {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: IBookingRepository,
    @Inject(EXPERT_PROFILE_REPOSITORY)
    private readonly profileRepo: IExpertProfileRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async createBooking(
    currentUser: AuthenticatedUser,
    dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const profile = await this.profileRepo.findById(dto.expertProfileId);
    if (!profile) {
      throw new NotFoundException('Expert not found');
    }

    if (profile.userId === currentUser.id) {
      throw new BadRequestException('Cannot book yourself');
    }

    const startTime = new Date(dto.scheduledStartTime);
    if (startTime <= new Date()) {
      throw new BadRequestException('Cannot book in the past');
    }

    const endTime = new Date(
      startTime.getTime() + profile.sessionDurationMinutes * 60 * 1000,
    );

    const conflict = await this.bookingRepo.findConflicting(
      profile.id,
      startTime,
      endTime,
    );
    if (conflict) {
      throw new ConflictException('Time slot is already booked');
    }

    const booking = new Booking();
    booking.clientId = currentUser.id;
    booking.expertProfileId = profile.id;
    booking.scheduledStartTime = startTime;
    booking.scheduledEndTime = endTime;
    booking.amountMillimes = profile.sessionPriceMillimes;
    booking.status = BookingStatus.PENDING_PAYMENT;
    booking.sessionRoomId = uuidv4();

    const saved = await this.bookingRepo.save(booking);

    const paymentResult = await this.paymentGateway.capturePayment({
      bookingId: saved.id,
      amountMillimes: saved.amountMillimes,
      currency: 'TND',
      idempotencyKey: `booking-${saved.id}`,
    });

    if (paymentResult.success) {
      saved.paymentId = paymentResult.transactionId;
      saved.confirm();
      await this.bookingRepo.save(saved);
    }

    return this.toResponseDto(saved);
  }

  async cancelBooking(
    currentUser: AuthenticatedUser,
    bookingId: string,
    dto: CancelBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isClient = booking.clientId === currentUser.id;
    const isExpert = booking.expertProfile?.userId === currentUser.id;

    if (!isClient && !isExpert && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
    }

    if (isClient) {
      booking.cancelByClient(dto.reason);
    } else {
      booking.cancelByExpert(dto.reason);
    }

    if (booking.refundAmountMillimes > 0 && booking.paymentId) {
      await this.paymentGateway.refund({
        transactionId: booking.paymentId,
        amountMillimes: booking.refundAmountMillimes,
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
      throw new NotFoundException('Booking not found');
    }

    const isClient = booking.clientId === currentUser.id;
    const isExpert = booking.expertProfile?.userId === currentUser.id;
    if (!isClient && !isExpert && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
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
      throw new NotFoundException('Expert profile not found');
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
      amountMillimes: booking.amountMillimes,
      refundAmountMillimes: booking.refundAmountMillimes,
      refundEligibility: booking.getRefundEligibility(),
      sessionRoomId: booking.sessionRoomId,
    });
  }
}
