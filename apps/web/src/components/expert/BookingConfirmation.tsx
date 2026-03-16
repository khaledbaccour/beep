import { ArrowLeft, Shield, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExpertProfile, AvailableSlot } from '@/lib/api';
import type { Dictionary } from '@/i18n/types';
import { formatDate, formatTime, formatPrice } from './utils';

interface BookingConfirmationProps {
  expert: ExpertProfile;
  selectedDate: Date;
  selectedSlot: AvailableSlot;
  notes: string;
  loading: boolean;
  error: string | null;
  dict: Dictionary;
  lang: string;
  onNotesChange: (value: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingConfirmation({
  expert,
  selectedDate,
  selectedSlot,
  notes,
  loading,
  error,
  dict,
  lang,
  onNotesChange,
  onBack,
  onConfirm,
}: BookingConfirmationProps) {
  const t = dict.expertProfile;
  const priceTND = formatPrice(expert.sessionPriceMillimes);

  const trustItems = [
    { icon: Shield, text: t.refundPolicy },
    { icon: Clock, text: t.escrow },
  ];

  return (
    <section className="pt-24 pb-20">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          {t.backToProfile}
        </button>

        <div className="rounded-xl border-[2.5px] border-[#141418] shadow-retro p-6">
          <h2 className="text-lg font-display font-bold text-ink-900 mb-5">{t.confirmBooking}</h2>

          <div className="space-y-3 mb-6">
            <SummaryRow label={t.expert} value={`${expert.firstName} ${expert.lastName}`} />
            <SummaryRow label={t.date} value={formatDate(selectedDate, lang)} />
            <SummaryRow
              label={t.time}
              value={`${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}`}
            />
            <SummaryRow label={t.duration} value={`${expert.sessionDurationMinutes} min`} />
            <div className="border-t border-ink-100 pt-3 flex justify-between">
              <span className="font-bold text-ink-900">{t.price}</span>
              <span className="font-bold text-ink-900">{priceTND} {dict.common.tnd}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{t.notes}</label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder={t.notesPlaceholder}
              rows={3}
              className="w-full rounded-lg border-[2px] border-ink-200 px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:border-[#141418] focus:outline-none transition-colors resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <Button
            variant="brand"
            size="lg"
            className="w-full"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                {t.processing}
              </span>
            ) : (
              `${t.payAndBook} — ${priceTND} ${dict.common.tnd}`
            )}
          </Button>

          <div className="mt-4 space-y-2">
            {trustItems.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2">
                <Icon size={12} className="text-ink-400 mt-0.5 shrink-0" />
                <span className="text-xs text-ink-400">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-400">{label}</span>
      <span className="text-ink-700">{value}</span>
    </div>
  );
}
