import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DayOfWeek } from '@beep/shared';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { ExpertProfile } from '../../../expert-profile/domain/entities/expert-profile.entity';

@Entity('availability_schedules')
export class AvailabilitySchedule extends BaseEntity {
  @Column()
  expertProfileId!: string;

  @ManyToOne(() => ExpertProfile)
  @JoinColumn({ name: 'expertProfileId' })
  expertProfile!: ExpertProfile;

  @Column({ type: 'enum', enum: DayOfWeek })
  dayOfWeek!: DayOfWeek;

  /** Start time in HH:mm format (24h) */
  @Column({ type: 'time' })
  startTime!: string;

  /** End time in HH:mm format (24h) */
  @Column({ type: 'time' })
  endTime!: string;

  @Column({ default: true })
  isActive!: boolean;
}
