import { Injectable } from '@nestjs/common';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export interface BookingConfirmedClientData {
  clientFirstName: string;
  bookingId: string;
  expertName: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  durationMinutes: number;
  amountCents: number;
  sessionRoomId: string;
  appUrl: string;
  lang: string;
}

export interface BookingConfirmedExpertData {
  expertFirstName: string;
  clientName: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  durationMinutes: number;
  amountCents: number;
  sessionRoomId: string;
  appUrl: string;
  lang: string;
}

export interface AvailabilityReminderData {
  expertFirstName: string;
  weekStartDate: string;
  appUrl: string;
  lang: string;
}

export interface ReminderData {
  recipientFirstName: string;
  otherPartyName: string;
  scheduledStartTime: Date;
  hoursUntil: number;
  sessionRoomId: string;
  appUrl: string;
  lang: string;
}

@Injectable()
export class EmailTemplatesService {
  bookingConfirmedClient(data: BookingConfirmedClientData): EmailContent {
    const date = this.formatDate(data.scheduledStartTime);
    const time = this.formatTimeRange(data.scheduledStartTime, data.scheduledEndTime);
    const amount = this.formatCents(data.amountCents);
    const link = this.meetingLink(data.appUrl, data.lang, data.sessionRoomId);
    const refId = data.bookingId.slice(0, 8).toUpperCase();

    return {
      subject: `Payment Confirmed - Session with ${data.expertName}`,
      html: this.layout(`
        <h1 style="color:#FF6B35;margin:0 0 8px;font-size:24px;font-family:'Space Grotesk',sans-serif;">Payment Confirmed</h1>
        <p style="color:#94a3b8;margin:0 0 24px;font-size:14px;">Your session has been booked successfully.</p>

        <div style="background:#0f172a;border:2px solid #334155;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Booking ID</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;font-family:monospace;">#${refId}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Expert</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${data.expertName}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Date</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${date}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Time</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${time}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Duration</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${data.durationMinutes} minutes</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Type</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">Video Call</td>
            </tr>
            <tr style="border-top:1px solid #334155;">
              <td style="color:#FF6B35;padding:12px 0 6px;font-size:14px;font-weight:bold;">Amount Paid</td>
              <td style="color:#FF6B35;padding:12px 0 6px;font-size:14px;font-weight:bold;text-align:right;">${amount}</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin-bottom:24px;">
          <a href="${link}" style="display:inline-block;background:#FF6B35;color:#0f172a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;border:2px solid #0f172a;">
            Join Session
          </a>
          <p style="color:#64748b;font-size:12px;margin-top:8px;">The link will be active 5 minutes before your session starts.</p>
        </div>

        <div style="background:#0f172a;border:2px solid #334155;border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;font-weight:bold;">Cancellation Policy</p>
          <ul style="color:#94a3b8;font-size:12px;margin:0;padding-left:16px;">
            <li style="margin-bottom:4px;">24h+ before session: full refund</li>
            <li style="margin-bottom:4px;">2-24h before session: 50% refund</li>
            <li>Less than 2h before: no refund</li>
          </ul>
        </div>
      `),
      text: [
        `Payment Confirmed - Session with ${data.expertName}`,
        '',
        `Hi ${data.clientFirstName},`,
        '',
        `Your session has been booked successfully.`,
        '',
        `Booking ID: #${refId}`,
        `Expert: ${data.expertName}`,
        `Date: ${date}`,
        `Time: ${time}`,
        `Duration: ${data.durationMinutes} minutes`,
        `Amount Paid: ${amount}`,
        '',
        `Join your session: ${link}`,
        '(The link will be active 5 minutes before your session starts.)',
        '',
        `Cancellation Policy:`,
        `- 24h+ before: full refund`,
        `- 2-24h before: 50% refund`,
        `- Less than 2h: no refund`,
      ].join('\n'),
    };
  }

  bookingConfirmedExpert(data: BookingConfirmedExpertData): EmailContent {
    const date = this.formatDate(data.scheduledStartTime);
    const time = this.formatTimeRange(data.scheduledStartTime, data.scheduledEndTime);
    const amount = this.formatCents(data.amountCents);
    const link = this.meetingLink(data.appUrl, data.lang, data.sessionRoomId);

    return {
      subject: `New Booking - ${data.clientName} on ${date}`,
      html: this.layout(`
        <h1 style="color:#FF6B35;margin:0 0 8px;font-size:24px;font-family:'Space Grotesk',sans-serif;">New Booking!</h1>
        <p style="color:#94a3b8;margin:0 0 24px;font-size:14px;">A client has booked a session with you.</p>

        <div style="background:#0f172a;border:2px solid #334155;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Client</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${data.clientName}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Date</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${date}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Time</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${time}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Duration</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${data.durationMinutes} minutes</td>
            </tr>
            <tr style="border-top:1px solid #334155;">
              <td style="color:#FF6B35;padding:12px 0 6px;font-size:14px;font-weight:bold;">Earnings</td>
              <td style="color:#FF6B35;padding:12px 0 6px;font-size:14px;font-weight:bold;text-align:right;">${amount}</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin-bottom:24px;">
          <a href="${link}" style="display:inline-block;background:#FF6B35;color:#0f172a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;border:2px solid #0f172a;">
            Join Session
          </a>
          <p style="color:#64748b;font-size:12px;margin-top:8px;">The link will be active 5 minutes before the session starts.</p>
        </div>
      `),
      text: [
        `New Booking - ${data.clientName}`,
        '',
        `Hi ${data.expertFirstName},`,
        '',
        `A client has booked a session with you.`,
        '',
        `Client: ${data.clientName}`,
        `Date: ${date}`,
        `Time: ${time}`,
        `Duration: ${data.durationMinutes} minutes`,
        `Earnings: ${amount}`,
        '',
        `Join your session: ${link}`,
      ].join('\n'),
    };
  }

  reminderClient(data: ReminderData): EmailContent {
    const date = this.formatDate(data.scheduledStartTime);
    const timeStr = this.formatTime(data.scheduledStartTime);
    const link = this.meetingLink(data.appUrl, data.lang, data.sessionRoomId);
    const hourLabel = data.hoursUntil === 1 ? '1 hour' : `${data.hoursUntil} hours`;

    return {
      subject: `Reminder: Session with ${data.otherPartyName} in ${hourLabel}`,
      html: this.layout(`
        <h1 style="color:#FF6B35;margin:0 0 8px;font-size:24px;font-family:'Space Grotesk',sans-serif;">Session Reminder</h1>
        <p style="color:#94a3b8;margin:0 0 24px;font-size:14px;">Your session with <strong style="color:#f1f5f9;">${data.otherPartyName}</strong> starts in <strong style="color:#FF6B35;">${hourLabel}</strong>.</p>

        <div style="background:#0f172a;border:2px solid #334155;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Expert</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${data.otherPartyName}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Date</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${date}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Time</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${timeStr}</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin-bottom:24px;">
          <a href="${link}" style="display:inline-block;background:#FF6B35;color:#0f172a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;border:2px solid #0f172a;">
            Join Session
          </a>
        </div>
      `),
      text: [
        `Session Reminder`,
        '',
        `Hi ${data.recipientFirstName},`,
        '',
        `Your session with ${data.otherPartyName} starts in ${hourLabel}.`,
        `Date: ${date}`,
        `Time: ${timeStr}`,
        '',
        `Join your session: ${link}`,
      ].join('\n'),
    };
  }

  reminderExpert(data: ReminderData): EmailContent {
    const date = this.formatDate(data.scheduledStartTime);
    const timeStr = this.formatTime(data.scheduledStartTime);
    const link = this.meetingLink(data.appUrl, data.lang, data.sessionRoomId);
    const hourLabel = data.hoursUntil === 1 ? '1 hour' : `${data.hoursUntil} hours`;

    return {
      subject: `Reminder: Session with ${data.otherPartyName} in ${hourLabel}`,
      html: this.layout(`
        <h1 style="color:#FF6B35;margin:0 0 8px;font-size:24px;font-family:'Space Grotesk',sans-serif;">Upcoming Session</h1>
        <p style="color:#94a3b8;margin:0 0 24px;font-size:14px;">Your session with <strong style="color:#f1f5f9;">${data.otherPartyName}</strong> starts in <strong style="color:#FF6B35;">${hourLabel}</strong>.</p>

        <div style="background:#0f172a;border:2px solid #334155;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Client</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${data.otherPartyName}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Date</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${date}</td>
            </tr>
            <tr>
              <td style="color:#94a3b8;padding:6px 0;font-size:13px;">Time</td>
              <td style="color:#f1f5f9;padding:6px 0;font-size:13px;text-align:right;">${timeStr}</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin-bottom:24px;">
          <a href="${link}" style="display:inline-block;background:#FF6B35;color:#0f172a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;border:2px solid #0f172a;">
            Join Session
          </a>
        </div>
      `),
      text: [
        `Upcoming Session`,
        '',
        `Hi ${data.recipientFirstName},`,
        '',
        `Your session with ${data.otherPartyName} starts in ${hourLabel}.`,
        `Date: ${date}`,
        `Time: ${timeStr}`,
        '',
        `Join your session: ${link}`,
      ].join('\n'),
    };
  }

  availabilityReminder(data: AvailabilityReminderData): EmailContent {
    const lang = data.lang || 'fr';
    const locale = lang === 'en' ? 'en-US' : 'fr-FR';
    const weekDate = new Date(data.weekStartDate + 'T00:00:00Z');
    const weekLabel = weekDate.toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Europe/Paris',
    });
    const dashboardLink = `${data.appUrl}/${lang}/dashboard?tab=availability`;

    const t = {
      fr: {
        subject: `Planifiez vos disponibilités pour la semaine du ${weekLabel}`,
        title: 'Planifiez votre semaine',
        greeting: `Bonjour <strong style="color:#f1f5f9;">${data.expertFirstName}</strong>,`,
        body: `vous n'avez pas encore défini vos disponibilités pour la semaine du <strong style="color:#FF6B35;">${weekLabel}</strong>.`,
        cta_detail: 'Sans disponibilités, les clients ne pourront pas réserver de sessions avec vous. Prenez un moment pour planifier votre semaine.',
        cta: 'Planifier mes disponibilités',
        tip: 'Astuce : activez la planification récurrente pour ne plus recevoir ce rappel.',
      },
      en: {
        subject: `Plan your availability for the week of ${weekLabel}`,
        title: 'Plan your week',
        greeting: `Hi <strong style="color:#f1f5f9;">${data.expertFirstName}</strong>,`,
        body: `you haven't set your availability for the week of <strong style="color:#FF6B35;">${weekLabel}</strong> yet.`,
        cta_detail: 'Without availability, clients won\'t be able to book sessions with you. Take a moment to plan your week.',
        cta: 'Plan my availability',
        tip: 'Tip: enable recurring scheduling to stop receiving this reminder.',
      },
    }[lang] ?? {
      subject: `Planifiez vos disponibilités pour la semaine du ${weekLabel}`,
      title: 'Planifiez votre semaine',
      greeting: `Bonjour <strong style="color:#f1f5f9;">${data.expertFirstName}</strong>,`,
      body: `vous n'avez pas encore défini vos disponibilités pour la semaine du <strong style="color:#FF6B35;">${weekLabel}</strong>.`,
      cta_detail: 'Sans disponibilités, les clients ne pourront pas réserver de sessions avec vous.',
      cta: 'Planifier mes disponibilités',
      tip: 'Astuce : activez la planification récurrente pour ne plus recevoir ce rappel.',
    };

    return {
      subject: t.subject,
      html: this.layout(`
        <h1 style="color:#FF6B35;margin:0 0 8px;font-size:24px;font-family:'Space Grotesk',sans-serif;">${t.title}</h1>
        <p style="color:#94a3b8;margin:0 0 24px;font-size:14px;">
          ${t.greeting} ${t.body}
        </p>

        <p style="color:#94a3b8;margin:0 0 24px;font-size:14px;">
          ${t.cta_detail}
        </p>

        <div style="text-align:center;margin-bottom:24px;">
          <a href="${dashboardLink}" style="display:inline-block;background:#FF6B35;color:#0f172a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;border:2px solid #0f172a;">
            ${t.cta}
          </a>
        </div>

        <p style="color:#64748b;font-size:12px;margin:0;text-align:center;">
          ${t.tip}
        </p>
      `),
      text: [
        t.title,
        '',
        t.greeting.replace(/<[^>]*>/g, ''),
        t.body.replace(/<[^>]*>/g, ''),
        '',
        t.cta_detail,
        '',
        `${t.cta}: ${dashboardLink}`,
        '',
        t.tip,
      ].join('\n'),
    };
  }

  private formatCents(cents: number): string {
    const eur = cents / 100;
    return `${eur.toFixed(2)} EUR`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Paris',
    });
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
      hour12: false,
    });
  }

  private formatTimeRange(start: Date, end: Date): string {
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }

  private meetingLink(appUrl: string, lang: string, roomId: string): string {
    return `${appUrl}/${lang}/session/${roomId}`;
  }

  private layout(content: string): string {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <!-- Header -->
        <tr><td style="padding:0 0 32px;text-align:center;">
          <h2 style="margin:0;font-size:28px;font-family:'Space Grotesk',sans-serif;letter-spacing:-0.5px;">
            <span style="color:#FF6B35;">beep</span><span style="color:#f1f5f9;">.tn</span>
          </h2>
        </td></tr>
        <!-- Content -->
        <tr><td style="background:#1e293b;border:2px solid #334155;border-radius:16px;padding:32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="color:#475569;font-size:11px;margin:0;">
            Questions? Reply to this email or contact us at bookings@beep.fr
          </p>
          <p style="color:#334155;font-size:11px;margin:8px 0 0;">
            &copy; 2026 Beep. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }
}
