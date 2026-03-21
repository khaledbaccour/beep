import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { ExpertProfile } from '../../../expert-profile/domain/entities/expert-profile.entity';

@Entity('weekly_availability_slots')
export class WeeklyAvailabilitySlot extends BaseEntity {
  @Column()
  expertProfileId!: string;

  @ManyToOne(() => ExpertProfile)
  @JoinColumn({ name: 'expertProfileId' })
  expertProfile!: ExpertProfile;

  /** Specific date in YYYY-MM-DD format */
  @Column({ type: 'date' })
  date!: string;

  /** Start time in HH:mm format (24h) */
  @Column({ type: 'time' })
  startTime!: string;

  /** End time in HH:mm format (24h) */
  @Column({ type: 'time' })
  endTime!: string;
}
