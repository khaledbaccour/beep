import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailSender, EmailPayload } from '../../domain/ports/email-sender.interface';

@Injectable()
export class NodemailerEmailAdapter implements IEmailSender {
  private readonly logger = new Logger(NodemailerEmailAdapter.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: this.configService.get<number>('smtp.port'),
      secure: this.configService.get<boolean>('smtp.secure'),
      auth: {
        user: this.configService.get<string>('smtp.user'),
        pass: this.configService.get<string>('smtp.pass'),
      },
    });
    this.fromAddress = this.configService.get<string>('smtp.from') || '';
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    const info = await this.transporter.sendMail({
      from: `"Beep" <${this.fromAddress}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    this.logger.log(`Email sent to ${payload.to}: ${info.messageId}`);
  }
}
