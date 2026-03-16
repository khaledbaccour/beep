import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionRoom } from '../../domain/entities/session-room.entity';
import { ChatMessage } from '../../domain/entities/chat-message.entity';
import { SessionStatus } from '@beep/shared';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionRoom)
    private readonly roomRepo: Repository<SessionRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
  ) {}

  async createRoom(bookingId: string, roomId: string): Promise<SessionRoom> {
    const room = new SessionRoom();
    room.bookingId = bookingId;
    room.roomId = roomId;
    room.status = SessionStatus.WAITING;
    return this.roomRepo.save(room);
  }

  async joinRoom(
    roomId: string,
    userId: string,
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
