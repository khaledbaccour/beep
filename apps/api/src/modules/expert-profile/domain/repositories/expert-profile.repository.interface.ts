import { ExpertProfile } from '../entities/expert-profile.entity';
import { ExpertCategory } from '@beep/shared';

export const EXPERT_PROFILE_REPOSITORY = Symbol('EXPERT_PROFILE_REPOSITORY');

export interface ExpertSearchFilters {
  category?: ExpertCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
}

export interface IExpertProfileRepository {
  findById(id: string): Promise<ExpertProfile | null>;
  findBySlug(slug: string): Promise<ExpertProfile | null>;
  findByUserId(userId: string): Promise<ExpertProfile | null>;
  findAll(filters: ExpertSearchFilters, skip: number, take: number): Promise<[ExpertProfile[], number]>;
  save(profile: ExpertProfile): Promise<ExpertProfile>;
  update(id: string, partial: Partial<ExpertProfile>): Promise<void>;
  slugExists(slug: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}
