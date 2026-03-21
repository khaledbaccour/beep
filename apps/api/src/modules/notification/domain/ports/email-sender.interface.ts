export const EMAIL_SENDER = Symbol('EMAIL_SENDER');

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface IEmailSender {
  sendEmail(payload: EmailPayload): Promise<void>;
}
