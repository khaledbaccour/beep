import { Entity, Column } from 'typeorm';
import { SessionStatus } from '@beep/shared';
import { BaseEntity } from '../../../../common/domain/base.entity';

@Entity('session_rooms')
export class SessionRoom extends BaseEntity {
  @Column()
  bookingId!: string;

  @Column({ unique: true })
  roomId!: string;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.WAITING })
  status!: SessionStatus;

  @Column({ nullable: true })
  expertPeerId?: string;

  @Column({ nullable: true })
  clientPeerId?: string;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt?: Date;
}
