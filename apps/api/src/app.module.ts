import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { IdentityModule } from './modules/identity/identity.module';
import { ExpertProfileModule } from './modules/expert-profile/expert-profile.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SessionModule } from './modules/session/session.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { NotificationModule } from './modules/notification/notification.module';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('database.url');
        const needsSsl =
          config.get<string>('NODE_ENV') === 'production' ||
          (databaseUrl && !databaseUrl.includes('localhost'));

        const baseConfig = {
          type: 'postgres' as const,
          autoLoadEntities: true,
          synchronize: true,
          ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
        };

        if (databaseUrl) {
          return { ...baseConfig, url: databaseUrl };
        }

        return {
          ...baseConfig,
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('redis.url');
        if (redisUrl) {
          const parsed = new URL(redisUrl);
          const useTls = parsed.protocol === 'rediss:';
          return {
            redis: {
              host: parsed.hostname,
              port: parseInt(parsed.port || '6379', 10),
              password: parsed.password || undefined,
              username: parsed.username || 'default',
              ...(useTls ? { tls: { rejectUnauthorized: false } } : {}),
            },
          };
        }
        return {
          redis: {
            host: config.get<string>('redis.host'),
            port: config.get<number>('redis.port'),
            password: config.get<string>('redis.password'),
          },
        };
      },
    }),
    IdentityModule,
    ExpertProfileModule,
    AvailabilityModule,
    BookingModule,
    PaymentModule,
    SessionModule,
    MarketplaceModule,
    NotificationModule,
  ],
})
export class AppModule {}
