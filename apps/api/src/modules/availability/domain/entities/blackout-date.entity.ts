import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { ExpertProfile } from '../../../expert-profile/domain/entities/expert-profile.entity';

@Entity('blackout_dates')
export class BlackoutDate extends BaseEntity {
  @Column()
  expertProfileId!: string;

  @ManyToOne(() => ExpertProfile)
  @JoinColumn({ name: 'expertProfileId' })
  expertProfile!: ExpertProfile;

  @Column({ type: 'date' })
  date!: string;

  @Column({ nullable: true })
  reason?: string;
}
