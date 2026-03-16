import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from '../../application/services/session.service';

interface JoinRoomPayload {
  roomId: string;
  peerId: string;
  userId: string;
  role: 'expert' | 'client';
}

interface ChatMessagePayload {
  roomId: string;
  senderId: string;
  content: string;
}

@WebSocketGateway({
  namespace: '/session',
  cors: { origin: '*' },
})
export class SessionGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly sessionService: SessionService) {}

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ): Promise<void> {
    await client.join(payload.roomId);
    await this.sessionService.joinRoom(
      payload.roomId,
      payload.userId,
      payload.peerId,
      payload.role,
    );
    client.to(payload.roomId).emit('user-joined', {
      peerId: payload.peerId,
      role: payload.role,
    });
  }

  @SubscribeMessage('chat-message')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatMessagePayload,
  ): Promise<void> {
    await this.sessionService.saveChatMessage(
      payload.roomId,
      payload.senderId,
      payload.content,
    );
    client.to(payload.roomId).emit('chat-message', {
      senderId: payload.senderId,
      content: payload.content,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ): Promise<void> {
    await client.leave(payload.roomId);
    client.to(payload.roomId).emit('user-left', { socketId: client.id });
  }

  async handleDisconnect(_client: Socket): Promise<void> {
    // Socket.IO handles room cleanup on disconnect
  }
}
