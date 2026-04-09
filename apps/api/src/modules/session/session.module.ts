import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRoom } from './domain/entities/session-room.entity';
import { ChatMessage } from './domain/entities/chat-message.entity';
import { SessionService } from './application/services/session.service';
import { SessionGateway } from './infrastructure/gateways/session.gateway';
import { SessionController } from './infrastructure/controllers/session.controller';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionRoom, ChatMessage]),
    BookingModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, SessionGateway],
  exports: [SessionService],
})
export class SessionModule {}
