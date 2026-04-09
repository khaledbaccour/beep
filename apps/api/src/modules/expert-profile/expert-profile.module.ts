import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertProfile } from './domain/entities/expert-profile.entity';
import { SessionOption } from './domain/entities/session-option.entity';
import { EXPERT_PROFILE_REPOSITORY } from './domain/repositories/expert-profile.repository.interface';
import { TypeOrmExpertProfileRepository } from './infrastructure/repositories/typeorm-expert-profile.repository';
import { ExpertProfileService } from './application/services/expert-profile.service';
import { ExpertProfileController } from './infrastructure/controllers/expert-profile.controller';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExpertProfile, SessionOption]), forwardRef(() => IdentityModule)],
  controllers: [ExpertProfileController],
  providers: [
    ExpertProfileService,
    {
      provide: EXPERT_PROFILE_REPOSITORY,
      useClass: TypeOrmExpertProfileRepository,
    },
  ],
  exports: [ExpertProfileService, EXPERT_PROFILE_REPOSITORY],
})
export class ExpertProfileModule {}
