import { ExpertCategory } from '@beep/shared';
import { SessionOptionResponseDto } from './session-option.dto';

export class ExpertProfileResponseDto {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio: string;
  headline?: string;
  category: ExpertCategory;
  tags?: string[];
  sessionPriceCents: number | null;
  sessionDurationMinutes: number;
  timezone: string;
  averageRating: number;
  totalSessions: number;
  sessionOptions: SessionOptionResponseDto[];

  constructor(partial: ExpertProfileResponseDto) {
    this.id = partial.id;
    this.slug = partial.slug;
    this.firstName = partial.firstName;
    this.lastName = partial.lastName;
    this.avatarUrl = partial.avatarUrl;
    this.bio = partial.bio;
    this.headline = partial.headline;
    this.category = partial.category;
    this.tags = partial.tags;
    this.sessionPriceCents = partial.sessionPriceCents;
    this.sessionDurationMinutes = partial.sessionDurationMinutes;
    this.timezone = partial.timezone;
    this.averageRating = partial.averageRating;
    this.totalSessions = partial.totalSessions;
    this.sessionOptions = partial.sessionOptions;
  }
}
