import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpertProfile } from '../../domain/entities/expert-profile.entity';
import {
  IExpertProfileRepository,
  ExpertSearchFilters,
} from '../../domain/repositories/expert-profile.repository.interface';

@Injectable()
export class TypeOrmExpertProfileRepository implements IExpertProfileRepository {
  constructor(
    @InjectRepository(ExpertProfile)
    private readonly repo: Repository<ExpertProfile>,
  ) {}

  async findById(id: string): Promise<ExpertProfile | null> {
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  async findBySlug(slug: string): Promise<ExpertProfile | null> {
    return this.repo.findOne({ where: { slug }, relations: ['user'] });
  }

  async findByUserId(userId: string): Promise<ExpertProfile | null> {
    return this.repo.findOne({ where: { userId }, relations: ['user'] });
  }

  async findAll(
    filters: ExpertSearchFilters,
    skip: number,
    take: number,
  ): Promise<[ExpertProfile[], number]> {
    const qb = this.repo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('profile.isVisible = :visible', { visible: true });

    if (filters.category) {
      qb.andWhere('profile.category = :category', { category: filters.category });
    }
    if (filters.minPrice !== undefined) {
      qb.andWhere('profile.sessionPriceMillimes >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      qb.andWhere('profile.sessionPriceMillimes <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    if (filters.search) {
      qb.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR profile.bio ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.isFeatured) {
      qb.andWhere('profile.isFeatured = :featured', { featured: true });
    }

    qb.orderBy('profile.averageRating', 'DESC').skip(skip).take(take);

    return qb.getManyAndCount();
  }

  async save(profile: ExpertProfile): Promise<ExpertProfile> {
    return this.repo.save(profile);
  }

  async update(id: string, partial: Partial<ExpertProfile>): Promise<void> {
    await this.repo.update(id, partial);
  }

  async slugExists(slug: string): Promise<boolean> {
    const count = await this.repo.count({ where: { slug } });
    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
