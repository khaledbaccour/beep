import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionRoom } from '../../domain/entities/session-room.entity';
import { ChatMessage } from '../../domain/entities/chat-message.entity';
import { SessionStatus } from '@beep/shared';
import {
  IBookingRepository,
  BOOKING_REPOSITORY,
} from '../../../booking/domain/repositories/booking.repository.interface';
import { SessionAccessResponseDto } from '../dtos/session-access.dto';

const ACCESS_WINDOW_BEFORE_MIN = 5;
const ACCESS_WINDOW_AFTER_MIN = 5;

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionRoom)
    private readonly roomRepo: Repository<SessionRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: IBookingRepository,
  ) {}

  async checkAccess(
    roomId: string,
    userId: string,
  ): Promise<SessionAccessResponseDto> {
    const booking = await this.bookingRepo.findBySessionRoomId(roomId);

    if (!booking) {
      return new SessionAccessResponseDto({ allowed: false, reason: 'NOT_FOUND' });
    }

    const isParticipant =
      booking.clientId === userId ||
      booking.expertProfile?.userId === userId;

    if (!isParticipant) {
      return new SessionAccessResponseDto({ allowed: false, reason: 'FORBIDDEN' });
    }

    const now = new Date();
    const windowOpenAt = new Date(
      booking.scheduledStartTime.getTime() - ACCESS_WINDOW_BEFORE_MIN * 60 * 1000,
    );
    const windowCloseAt = new Date(
      booking.scheduledEndTime.getTime() + ACCESS_WINDOW_AFTER_MIN * 60 * 1000,
    );

    if (now < windowOpenAt) {
      const minutesUntilStart = Math.ceil(
        (windowOpenAt.getTime() - now.getTime()) / (60 * 1000),
      );
      return new SessionAccessResponseDto({
        allowed: false,
        reason: 'TOO_EARLY',
        scheduledStartTime: booking.scheduledStartTime,
        scheduledEndTime: booking.scheduledEndTime,
        minutesUntilStart,
        expertName: booking.expertProfile?.user?.fullName,
        clientName: booking.client?.fullName,
      });
    }

    if (now > windowCloseAt) {
      return new SessionAccessResponseDto({ allowed: false, reason: 'EXPIRED' });
    }

    return new SessionAccessResponseDto({
      allowed: true,
      scheduledStartTime: booking.scheduledStartTime,
      scheduledEndTime: booking.scheduledEndTime,
      expertName: booking.expertProfile?.user?.fullName,
      clientName: booking.client?.fullName,
    });
  }

  async createRoom(bookingId: string, roomId: string): Promise<SessionRoom> {
    const room = new SessionRoom();
    room.bookingId = bookingId;
    room.roomId = roomId;
    room.status = SessionStatus.WAITING;
    return this.roomRepo.save(room);
  }

  async joinRoom(
    roomId: string,
    _userId: string,
    peerId: string,
    role: 'expert' | 'client',
  ): Promise<void> {
    const room = await this.roomRepo.findOne({ where: { roomId } });
    if (!room) return;

    if (role === 'expert') {
      room.expertPeerId = peerId;
    } else {
      room.clientPeerId = peerId;
    }

    if (room.expertPeerId && room.clientPeerId) {
      room.status = SessionStatus.ACTIVE;
      room.startedAt = new Date();
    }

    await this.roomRepo.save(room);
  }

  async endRoom(roomId: string): Promise<void> {
    const room = await this.roomRepo.findOne({ where: { roomId } });
    if (!room) return;

    room.status = SessionStatus.ENDED;
    room.endedAt = new Date();
    await this.roomRepo.save(room);
  }

  async saveChatMessage(
    roomId: string,
    senderId: string,
    content: string,
  ): Promise<ChatMessage> {
    const room = await this.roomRepo.findOne({ where: { roomId } });
    if (!room) {
      throw new Error('Session room not found');
    }

    const message = new ChatMessage();
    message.sessionRoomId = room.id;
    message.senderId = senderId;
    message.content = content;
    return this.chatRepo.save(message);
  }

  async getChatHistory(roomId: string): Promise<ChatMessage[]> {
    const room = await this.roomRepo.findOne({ where: { roomId } });
    if (!room) return [];

    return this.chatRepo.find({
      where: { sessionRoomId: room.id },
      order: { createdAt: 'ASC' },
    });
  }
}
