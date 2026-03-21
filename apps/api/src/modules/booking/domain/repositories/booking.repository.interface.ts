import { Booking } from '../entities/booking.entity';
import { BookingStatus } from '@beep/shared';

export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findBySessionRoomId(sessionRoomId: string): Promise<Booking | null>;
  findByClientId(clientId: string, status?: BookingStatus): Promise<Booking[]>;
  findByExpertProfileId(expertProfileId: string, status?: BookingStatus): Promise<Booking[]>;
  findConflicting(expertProfileId: string, startTime: Date, endTime: Date): Promise<Booking | null>;
  save(booking: Booking): Promise<Booking>;
  findUpcoming(expertProfileId: string, from: Date): Promise<Booking[]>;
  findPendingNoShowCheck(before: Date): Promise<Booking[]>;
  findCompletedPendingRelease(olderThan: Date): Promise<Booking[]>;
}
