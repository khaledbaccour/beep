import { Entity, Column } from 'typeorm';
import { NotificationType } from '@beep/shared';
import { BaseEntity } from '../../../../common/domain/base.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, string>;
}
