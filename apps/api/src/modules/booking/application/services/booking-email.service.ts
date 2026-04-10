import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IEmailSender,
  EMAIL_SENDER,
} from '../../../notification/domain/ports/email-sender.interface';
import { EmailTemplatesService } from '../../../notification/infrastructure/templates/email-templates.service';
import { Booking } from '../../domain/entities/booking.entity';

@Injectable()
export class BookingEmailService {
  private readonly logger = new Logger(BookingEmailService.name);
  private readonly appUrl: string;

  constructor(
    @Inject(EMAIL_SENDER)
    private readonly emailSender: IEmailSender,
    private readonly templates: EmailTemplatesService,
    private readonly configService: ConfigService,
  ) {
    this.appUrl = this.configService.get<string>('APP_URL') || 'https://beep.fr';
  }

  async sendBookingConfirmedToClient(booking: Booking): Promise<void> {
    const durationMinutes = this.getDurationMinutes(booking);
    const content = this.templates.bookingConfirmedClient({
      clientFirstName: booking.client.firstName,
      bookingId: booking.id,
      expertName: booking.expertProfile.user.fullName,
      scheduledStartTime: booking.scheduledStartTime,
      scheduledEndTime: booking.scheduledEndTime,
      durationMinutes,
      amountCents: booking.amountCents,
      sessionRoomId: booking.sessionRoomId!,
      appUrl: this.appUrl,
      lang: 'en',
    });

    await this.emailSender.sendEmail({
      to: booking.client.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    this.logger.log(`Booking confirmation sent to client ${booking.client.email}`);
  }

  async sendBookingConfirmedToExpert(booking: Booking): Promise<void> {
    const expertUser = booking.expertProfile.user;
    const durationMinutes = this.getDurationMinutes(booking);
    const content = this.templates.bookingConfirmedExpert({
      expertFirstName: expertUser.firstName,
      clientName: booking.client.fullName,
      scheduledStartTime: booking.scheduledStartTime,
      scheduledEndTime: booking.scheduledEndTime,
      durationMinutes,
      amountCents: booking.amountCents,
      sessionRoomId: booking.sessionRoomId!,
      appUrl: this.appUrl,
      lang: 'en',
    });

    await this.emailSender.sendEmail({
      to: expertUser.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    this.logger.log(`Booking notification sent to expert ${expertUser.email}`);
  }

  async sendReminderToClient(booking: Booking, hoursUntil: 24 | 1): Promise<void> {
    const content = this.templates.reminderClient({
      recipientFirstName: booking.client.firstName,
      otherPartyName: booking.expertProfile.user.fullName,
      scheduledStartTime: booking.scheduledStartTime,
      hoursUntil,
      sessionRoomId: booking.sessionRoomId!,
      appUrl: this.appUrl,
      lang: 'en',
    });

    await this.emailSender.sendEmail({
      to: booking.client.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    this.logger.log(`${hoursUntil}h reminder sent to client ${booking.client.email}`);
  }

  async sendReminderToExpert(booking: Booking, hoursUntil: 24 | 1): Promise<void> {
    const expertUser = booking.expertProfile.user;
    const content = this.templates.reminderExpert({
      recipientFirstName: expertUser.firstName,
      otherPartyName: booking.client.fullName,
      scheduledStartTime: booking.scheduledStartTime,
      hoursUntil,
      sessionRoomId: booking.sessionRoomId!,
      appUrl: this.appUrl,
      lang: 'en',
    });

    await this.emailSender.sendEmail({
      to: expertUser.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    this.logger.log(`${hoursUntil}h reminder sent to expert ${expertUser.email}`);
  }

  private getDurationMinutes(booking: Booking): number {
    if (booking.durationMinutes) return booking.durationMinutes;
    return Math.round(
      (booking.scheduledEndTime.getTime() - booking.scheduledStartTime.getTime()) / 60000,
    );
  }
}
