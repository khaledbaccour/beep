import { NotificationType } from '@beep/shared';

export const NOTIFICATION_SENDER = Symbol('NOTIFICATION_SENDER');

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, string>;
}

export interface INotificationSender {
  send(payload: NotificationPayload): Promise<void>;
}
