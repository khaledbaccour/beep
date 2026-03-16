import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './domain/entities/notification.entity';
import { NOTIFICATION_SENDER } from './domain/ports/notification-sender.interface';
import { EmailNotificationAdapter } from './infrastructure/adapters/email-notification.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    {
      provide: NOTIFICATION_SENDER,
      useClass: EmailNotificationAdapter,
    },
  ],
  exports: [NOTIFICATION_SENDER],
})
export class NotificationModule {}
