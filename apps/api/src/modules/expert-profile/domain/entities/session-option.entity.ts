import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { ExpertProfile } from './expert-profile.entity';

@Entity('session_options')
export class SessionOption extends BaseEntity {
  @Column()
  expertProfileId!: string;

  @ManyToOne(() => ExpertProfile, (profile) => profile.sessionOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expertProfileId' })
  expertProfile!: ExpertProfile;

  /** Duration in minutes (e.g. 15, 30, 45, 60, 90, 120) */
  @Column({ type: 'int' })
  durationMinutes!: number;

  /** Price in millimes (TND) */
  @Column({ type: 'int' })
  priceMillimes!: number;

  /** Optional label (e.g. "Quick Chat", "Deep Dive") */
  @Column({ type: 'varchar', length: 100, nullable: true })
  label?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
