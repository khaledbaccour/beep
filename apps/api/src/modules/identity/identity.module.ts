import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { User } from './domain/entities/user.entity';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { UsersController } from './infrastructure/controllers/users.controller';
import { ExpertProfileModule } from '../expert-profile/expert-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => ExpertProfileModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: `${config.get<number>('jwt.expirationSeconds')}s`,
        },
      }),
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [AuthService, USER_REPOSITORY],
})
export class IdentityModule {}
