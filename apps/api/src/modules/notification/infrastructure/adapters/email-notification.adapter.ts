import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  INotificationSender,
  NotificationPayload,
} from '../../domain/ports/notification-sender.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class EmailNotificationAdapter implements INotificationSender {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  async send(payload: NotificationPayload): Promise<void> {
    // Persist to DB (in-app notification)
    const notif = new Notification();
    notif.userId = payload.userId;
    notif.type = payload.type;
    notif.title = payload.title;
    notif.body = payload.body;
    notif.metadata = payload.metadata;
    await this.notifRepo.save(notif);

    // TODO: Send email via SMTP
  }
}
