import { Module } from '@nestjs/common';
import { MarketplaceController } from './infrastructure/controllers/marketplace.controller';
import { ExpertProfileModule } from '../expert-profile/expert-profile.module';

@Module({
  imports: [ExpertProfileModule],
  controllers: [MarketplaceController],
})
export class MarketplaceModule {}
