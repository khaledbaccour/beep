import { ExpertCategory, PayoutMethod } from '@beep/shared';
import type { Certification } from '@beep/shared';

export class OnboardingStatusResponseDto {
  currentStep: number;
  completed: boolean;
  profileCompleteness: number;
  profile: {
    slug?: string;
    bio?: string;
    headline?: string;
    category?: ExpertCategory;
    tags?: string[];
    certifications?: Certification[];
    yearsOfExperience?: number;
    languages?: string[];
    sessionPriceMillimes?: number;
    sessionDurationMinutes?: number;
    timezone?: string;
    payoutMethod?: PayoutMethod;
  };

  constructor(partial: OnboardingStatusResponseDto) {
    this.currentStep = partial.currentStep;
    this.completed = partial.completed;
    this.profileCompleteness = partial.profileCompleteness;
    this.profile = partial.profile;
  }
}
