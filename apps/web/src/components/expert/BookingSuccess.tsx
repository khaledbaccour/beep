import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BookingResponse } from '@/lib/api';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { formatTime, formatPrice } from './utils';

interface BookingSuccessProps {
  booking: BookingResponse;
  dict: Dictionary;
  lang: Locale;
  onGoToDashboard: () => void;
  onBackToProfile: () => void;
}

export function BookingSuccess({
  booking,
  dict,
  lang,
  onGoToDashboard,
  onBackToProfile,
}: BookingSuccessProps) {
  const t = dict.expertProfile;

  return (
    <section className="pt-24 pb-20">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="rounded-xl border-[2.5px] border-[#141418] shadow-retro p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-ink-900 mb-2">{t.bookingSuccess}</h2>
          <p className="text-sm text-ink-500 mb-6">{t.bookingSuccessMessage}</p>

          <div className="rounded-lg bg-ink-50 p-4 mb-6 text-left space-y-2">
            <DetailRow label={t.bookingId} value={`${booking.id.slice(0, 8)}...`} mono />
            <DetailRow label={t.expert} value={booking.expertName} />
            <DetailRow
              label={t.date}
              value={new Date(booking.scheduledStartTime).toLocaleDateString()}
            />
            <DetailRow
              label={t.time}
              value={`${formatTime(booking.scheduledStartTime)} - ${formatTime(booking.scheduledEndTime)}`}
            />
            <DetailRow
              label={t.price}
              value={`${formatPrice(booking.amountCents)} ${dict.common.eur}`}
              bold
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="brand" className="w-full" onClick={onGoToDashboard}>
              {t.goToDashboard}
            </Button>
            <Button variant="outline" className="w-full" onClick={onBackToProfile}>
              {t.backToProfile}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailRow({
  label,
  value,
  mono,
  bold,
}: {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-400">{label}</span>
      <span
        className={`${mono ? 'font-mono' : ''} ${bold ? 'font-bold text-ink-900' : 'text-ink-700'}`}
      >
        {value}
      </span>
    </div>
  );
}
