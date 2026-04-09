import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Booking } from '../../domain/entities/booking.entity';
import { IBookingRepository } from '../../domain/repositories/booking.repository.interface';
import { BookingStatus } from '@beep/shared';

@Injectable()
export class TypeOrmBookingRepository implements IBookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
  ) {}

  async findById(id: string): Promise<Booking | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['client', 'expertProfile', 'expertProfile.user'],
    });
  }

  async findBySessionRoomId(sessionRoomId: string): Promise<Booking | null> {
    return this.repo.findOne({
      where: { sessionRoomId },
      relations: ['client', 'expertProfile', 'expertProfile.user'],
    });
  }

  async findByClientId(clientId: string, status?: BookingStatus): Promise<Booking[]> {
    const where: Record<string, unknown> = { clientId };
    if (status) where['status'] = status;
    return this.repo.find({
      where,
      relations: ['expertProfile', 'expertProfile.user'],
      order: { scheduledStartTime: 'ASC' },
    });
  }

  async findByExpertProfileId(
    expertProfileId: string,
    status?: BookingStatus,
  ): Promise<Booking[]> {
    const where: Record<string, unknown> = { expertProfileId };
    if (status) where['status'] = status;
    return this.repo.find({
      where,
      relations: ['client'],
      order: { scheduledStartTime: 'ASC' },
    });
  }

  async findConflicting(
    expertProfileId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking | null> {
    return this.repo
      .createQueryBuilder('booking')
      .where('booking.expertProfileId = :expertProfileId', { expertProfileId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
      })
      .andWhere('booking.scheduledStartTime < :endTime', { endTime })
      .andWhere('booking.scheduledEndTime > :startTime', { startTime })
      .getOne();
  }

  async save(booking: Booking): Promise<Booking> {
    return this.repo.save(booking);
  }

  async findUpcoming(expertProfileId: string, from: Date): Promise<Booking[]> {
    return this.repo
      .createQueryBuilder('booking')
      .where('booking.expertProfileId = :expertProfileId', { expertProfileId })
      .andWhere('booking.scheduledStartTime > :from', { from })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .orderBy('booking.scheduledStartTime', 'ASC')
      .getMany();
  }

  async findPendingNoShowCheck(before: Date): Promise<Booking[]> {
    return this.repo
      .createQueryBuilder('booking')
      .where('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .andWhere('booking.scheduledStartTime < :before', { before })
      .getMany();
  }

  async findCompletedPendingRelease(olderThan: Date): Promise<Booking[]> {
    return this.repo.find({
      where: {
        status: BookingStatus.COMPLETED,
        updatedAt: LessThan(olderThan),
      },
    });
  }
}
