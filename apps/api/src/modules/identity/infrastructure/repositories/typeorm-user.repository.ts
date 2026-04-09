import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    if (!phone) return null;
    return this.repo.findOne({ where: { phone } });
  }

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async update(id: string, partial: Partial<User>): Promise<void> {
    await this.repo.update(id, partial);
  }
}
