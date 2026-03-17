import { UserRole } from '@beep/shared';

export class AuthResponseDto {
  accessToken: string;
  user: UserProfileDto;

  constructor(accessToken: string, user: UserProfileDto) {
    this.accessToken = accessToken;
    this.user = user;
  }
}

export class UserProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  onboardingCompleted: boolean;

  constructor(partial: UserProfileDto) {
    this.id = partial.id;
    this.email = partial.email;
    this.firstName = partial.firstName;
    this.lastName = partial.lastName;
    this.role = partial.role;
    this.avatarUrl = partial.avatarUrl;
    this.onboardingCompleted = partial.onboardingCompleted;
  }
}
