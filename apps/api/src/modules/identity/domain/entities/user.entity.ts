import { Entity, Column, OneToOne } from 'typeorm';
import { UserRole } from '@beep/shared';
import { BaseEntity } from '../../../../common/domain/base.entity';
import { ExpertProfile } from '../../../expert-profile/domain/entities/expert-profile.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role!: UserRole;

  @Column({ unique: true })
  phone!: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ default: true })
  onboardingCompleted!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  @OneToOne(() => ExpertProfile, (profile) => profile.user, { nullable: true })
  expertProfile?: ExpertProfile;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isExpert(): boolean {
    return this.role === UserRole.EXPERT;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
