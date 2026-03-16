import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../../common/domain/base.entity';

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @Column()
  sessionRoomId!: string;

  @Column()
  senderId!: string;

  @Column({ type: 'text' })
  content!: string;
}
