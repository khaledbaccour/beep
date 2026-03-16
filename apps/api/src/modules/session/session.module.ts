import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRoom } from './domain/entities/session-room.entity';
import { ChatMessage } from './domain/entities/chat-message.entity';
import { SessionService } from './application/services/session.service';
import { SessionGateway } from './infrastructure/gateways/session.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([SessionRoom, ChatMessage])],
  providers: [SessionService, SessionGateway],
  exports: [SessionService],
})
export class SessionModule {}
