import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ExpertCategory, PayoutMethod } from '@beep/shared';
import type { Certification } from '@beep/shared';
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
  @Column({ type: 'int', nullable: true })
  sessionPriceMillimes!: number | null;

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

  /** JSON array of certifications */
  @Column({ type: 'jsonb', nullable: true })
  certifications?: Certification[];

  /** Years of professional experience */
  @Column({ type: 'int', nullable: true })
  yearsOfExperience?: number;

  /** Languages the expert speaks */
  @Column({ type: 'simple-array', nullable: true })
  languages?: string[];

  /** Future payout method */
  @Column({ type: 'enum', enum: PayoutMethod, nullable: true })
  payoutMethod?: PayoutMethod;

  /** Payout details (to be encrypted in future) */
  @Column({ type: 'jsonb', nullable: true })
  payoutDetails?: Record<string, string>;

  /** Current onboarding step (1-4) */
  @Column({ type: 'int', default: 1 })
  onboardingStep!: number;

  /** Whether onboarding is fully completed */
  @Column({ default: false })
  onboardingCompleted!: boolean;

  /** Profile completeness percentage (0-100) */
  @Column({ type: 'int', default: 0 })
  profileCompleteness!: number;

  isSlugValid(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug);
  }

  calculateCompleteness(): number {
    let filled = 0;
    const totalFields = 10;

    if (this.slug) filled++;
    if (this.bio) filled++;
    if (this.headline) filled++;
    if (this.category) filled++;
    if (this.tags && this.tags.length > 0) filled++;
    if (this.sessionPriceMillimes) filled++;
    if (this.certifications && this.certifications.length > 0) filled++;
    if (this.yearsOfExperience !== undefined && this.yearsOfExperience !== null) filled++;
    if (this.languages && this.languages.length > 0) filled++;
    if (this.payoutMethod) filled++;

    return Math.round((filled / totalFields) * 100);
  }
}
