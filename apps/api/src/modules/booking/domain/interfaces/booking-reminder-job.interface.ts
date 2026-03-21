export interface BookingReminderJobData {
  bookingId: string;
  hoursUntil: 24 | 1;
  recipientType: 'client' | 'expert';
}
