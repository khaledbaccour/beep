import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ExpertCategory } from '@beep/shared';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { User } from '../../../identity/domain/entities/user.entity';

@Entity('expert_profiles')
export class ExpertProfile extends BaseEntity {
  @Column({ unique: true })
  slug!: string;

  @Column()
  userId!: string;

  @OneToOne(() => User, (user) => user.expertProfile)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'text' })
  bio!: string;

  @Column({ type: 'text', nullable: true })
  headline?: string;

  @Column({ type: 'enum', enum: ExpertCategory })
  category!: ExpertCategory;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  /** Session price in millimes (TND) */
  @Column({ type: 'int' })
  sessionPriceMillimes!: number;

  /** Default session duration in minutes */
  @Column({ type: 'int', default: 60 })
  sessionDurationMinutes!: number;

  @Column({ default: 'Africa/Tunis' })
  timezone!: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  averageRating!: number;

  @Column({ type: 'int', default: 0 })
  totalSessions!: number;

  @Column({ default: true })
  isVisible!: boolean;

  @Column({ default: false })
  isFeatured!: boolean;

  isSlugValid(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug);
  }
}
