import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  IAvailabilityRepository,
  AVAILABILITY_REPOSITORY,
} from '../../domain/repositories/availability.repository.interface';
import {
  IExpertProfileRepository,
  EXPERT_PROFILE_REPOSITORY,
} from '../../../expert-profile/domain/repositories/expert-profile.repository.interface';
import { IEmailSender, EMAIL_SENDER } from '../../../notification/domain/ports/email-sender.interface';
import { EmailTemplatesService } from '../../../notification/infrastructure/templates/email-templates.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AvailabilityReminderService {
  private readonly logger = new Logger(AvailabilityReminderService.name);

  constructor(
    @Inject(AVAILABILITY_REPOSITORY)
    private readonly availabilityRepo: IAvailabilityRepository,
    @Inject(EXPERT_PROFILE_REPOSITORY)
    private readonly profileRepo: IExpertProfileRepository,
    @Inject(EMAIL_SENDER)
    private readonly emailSender: IEmailSender,
    private readonly emailTemplates: EmailTemplatesService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Check all experts without recurring schedules and without
   * date-specific slots for the upcoming week. Send reminder emails.
   */
  async sendWeeklyReminders(): Promise<number> {
    const nextMonday = this.getNextMonday();
    const dates = this.getWeekDates(nextMonday);

    const expertsWithoutSlots = await this.availabilityRepo.findExpertsWithoutWeekSlots(dates);

    let sentCount = 0;

    for (const row of expertsWithoutSlots) {
      try {
        const profile = await this.profileRepo.findById(row.id);
        if (!profile) continue;

        const user = profile.user;
        if (!user?.email) continue;

        const appUrl = this.configService.get<string>('APP_URL') || 'https://beep.tn';
        const content = this.emailTemplates.availabilityReminder({
          expertFirstName: user.firstName,
          weekStartDate: nextMonday,
          appUrl,
          lang: 'fr',
        });

        await this.emailSender.sendEmail({
          to: user.email,
          subject: content.subject,
          html: content.html,
          text: content.text,
        });

        sentCount++;
        this.logger.log(`Sent availability reminder to ${user.email}`);
      } catch (error) {
        this.logger.error(`Failed to send reminder to expert ${row.id}`, error);
      }
    }

    this.logger.log(`Sent ${sentCount} availability reminders`);
    return sentCount;
  }

  private getNextMonday(): string {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ...
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMon = new Date(now);
    nextMon.setUTCDate(nextMon.getUTCDate() + daysUntilMonday);
    return nextMon.toISOString().split('T')[0];
  }

  private getWeekDates(mondayStr: string): string[] {
    const start = new Date(mondayStr + 'T00:00:00Z');
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }
}
