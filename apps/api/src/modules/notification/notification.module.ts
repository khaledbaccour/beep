import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './domain/entities/notification.entity';
import { NOTIFICATION_SENDER } from './domain/ports/notification-sender.interface';
import { EmailNotificationAdapter } from './infrastructure/adapters/email-notification.adapter';
import { EMAIL_SENDER } from './domain/ports/email-sender.interface';
import { NodemailerEmailAdapter } from './infrastructure/adapters/nodemailer-email.adapter';
import { EmailTemplatesService } from './infrastructure/templates/email-templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    {
      provide: NOTIFICATION_SENDER,
      useClass: EmailNotificationAdapter,
    },
    {
      provide: EMAIL_SENDER,
      useClass: NodemailerEmailAdapter,
    },
    EmailTemplatesService,
  ],
  exports: [NOTIFICATION_SENDER, EMAIL_SENDER, EmailTemplatesService],
})
export class NotificationModule {}
