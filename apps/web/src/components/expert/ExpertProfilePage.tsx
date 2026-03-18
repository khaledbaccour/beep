'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle2, Clock, Video, Shield, Loader2 } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import {
  getExpertBySlug,
  getAvailableSlots,
  getAvailableDates,
  createBooking,
  confirmBookingPayment,
  type ExpertProfile,
  type AvailableSlot,
  type BookingResponse,
} from '@/lib/api';
import {
  payWithCard,
  settlePendingPayments,
  setPendingBookingId,
  getPendingBookingId,
  clearPendingBookingId,
} from '@/lib/gammal-tech';
import { formatPrice, formatTime, formatDate, toDateString } from './utils';
import { DatePicker } from './DatePicker';
import { TimeSlotPicker } from './TimeSlotPicker';
import { BookingConfirmation } from './BookingConfirmation';
import { BookingSuccess } from './BookingSuccess';

interface ExpertProfilePageProps {
  slug: string;
  dict: Dictionary;
  lang: Locale;
}

type BookingStep = 'profile' | 'confirm' | 'success';

const VISIBLE_DAYS = 7;

function getAuthToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('beep_token') : null;
}

export function ExpertProfilePage({ slug, dict, lang }: ExpertProfilePageProps) {
  const t = dict.expertProfile;

  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [calendarStart, setCalendarStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [availableDatesLoading, setAvailableDatesLoading] = useState(false);

  const [step, setStep] = useState<BookingStep>('profile');
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);

  // Settle any pending/undelivered Gammal Tech payments on page load.
  // If a payment was interrupted (browser crash, tab closed), recover it
  // and confirm with our backend.
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    settlePendingPayments()
      .then(async (settlement) => {
        if (!settlement.recovered || !settlement.txn) return;

        const pendingBookingId = getPendingBookingId();
        if (!pendingBookingId) return;

        await confirmBookingPayment(pendingBookingId, settlement.txn, token);
        clearPendingBookingId();
      })
      .catch(() => {
        /* best-effort — ignore errors */
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getExpertBySlug(slug)
      .then((res) => {
        if (!cancelled) setExpert(res.data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t.error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug, t.error]);

  const fetchAvailableDatesForRange = useCallback(async (start: Date, expertId: string, signal: AbortSignal) => {
    setAvailableDatesLoading(true);
    try {
      const from = toDateString(start);
      const end = new Date(start);
      end.setDate(end.getDate() + VISIBLE_DAYS - 1);
      const to = toDateString(end);
      const res = await getAvailableDates(expertId, from, to);
      if (!signal.aborted) setAvailableDates(new Set(res.data));
    } catch {
      if (!signal.aborted) setAvailableDates(new Set());
    } finally {
      if (!signal.aborted) setAvailableDatesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!expert) return;
    const controller = new AbortController();
    fetchAvailableDatesForRange(calendarStart, expert.id, controller.signal);
    return () => controller.abort();
  }, [calendarStart, expert, fetchAvailableDatesForRange]);

  const fetchSlots = useCallback(async (date: Date, expertId: string) => {
    setSlotsLoading(true);
    setSelectedSlot(null);
    try {
      const res = await getAvailableSlots(expertId, toDateString(date));
      setSlots(res.data);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate && expert) {
      fetchSlots(selectedDate, expert.id);
    }
  }, [selectedDate, expert, fetchSlots]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep('profile');
  };

  const handleContinueToConfirm = () => {
    if (!selectedSlot) return;
    if (!getAuthToken()) {
      window.location.href = `/${lang}/login`;
      return;
    }
    setStep('confirm');
  };

  /**
   * Two-step payment flow:
   * 1. Create booking on our backend (PENDING_PAYMENT)
   * 2. Open Gammal Tech payment popup (client-side SDK)
   * 3. On success, confirm payment with our backend (CONFIRMED)
   */
  const handlePayAndBook = async () => {
    if (!expert || !selectedSlot) return;
    const token = getAuthToken();
    if (!token) {
      window.location.href = `/${lang}/login`;
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      // Step 1: Create booking (PENDING_PAYMENT)
      const bookingRes = await createBooking(
        {
          expertProfileId: expert.id,
          scheduledStartTime: selectedSlot.startTime,
        },
        token,
      );
      const pendingBooking = bookingRes.data;

      // Persist booking ID so settlePending can recover if browser crashes
      setPendingBookingId(pendingBooking.id);

      // Step 2: Open Gammal Tech payment popup
      const amountTND = expert.sessionPriceMillimes / 1000;
      const payment = await payWithCard(
        amountTND,
        `Beep: Session with ${expert.firstName} ${expert.lastName}`,
      );

      // Step 3: Confirm payment with our backend
      const confirmedRes = await confirmBookingPayment(
        pendingBooking.id,
        payment.txn,
        token,
      );

      clearPendingBookingId();
      setBooking(confirmedRes.data);
      setStep('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.paymentFailed;
      if (message !== 'Payment cancelled') {
        setBookingError(message);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setCalendarStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + (direction === 'next' ? VISIBLE_DAYS : -VISIBLE_DAYS));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return next < today ? today : next;
    });
  };

  const resetBookingFlow = () => {
    setStep('profile');
    setSelectedSlot(null);
    setSelectedDate(null);
    setBooking(null);
    setNotes('');
    setBookingError(null);
  };

  if (loading) {
    return (
      <section className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3 text-ink-400">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm">{t.loading}</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || !expert) {
    return (
      <section className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[400px]">
          <p className="text-sm text-red-500">{error || t.error}</p>
        </div>
      </section>
    );
  }

  const priceTND = formatPrice(expert.sessionPriceMillimes);

  if (step === 'success' && booking) {
    return (
      <BookingSuccess
        booking={booking}
        dict={dict}
        lang={lang}
        onGoToDashboard={() => (window.location.href = `/${lang}/dashboard`)}
        onBackToProfile={resetBookingFlow}
      />
    );
  }

  if (step === 'confirm' && selectedSlot && selectedDate) {
    return (
      <BookingConfirmation
        expert={expert}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        notes={notes}
        loading={bookingLoading}
        error={bookingError}
        dict={dict}
        lang={lang}
        onNotesChange={setNotes}
        onBack={() => setStep('profile')}
        onConfirm={handlePayAndBook}
      />
    );
  }

  return (
    <section className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile info */}
          <div className="flex-1">
            <ProfileHeader expert={expert} t={t} />

            <p className="text-sm text-ink-600 leading-relaxed mb-8">
              {expert.bio || t.description}
            </p>

            <div className="border-[2.5px] border-[#141418] rounded-xl p-5 shadow-retro">
              <DatePicker
                calendarStart={calendarStart}
                selectedDate={selectedDate}
                availableDates={availableDates}
                availableDatesLoading={availableDatesLoading}
                lang={lang}
                labels={{ selectDate: t.selectDate }}
                onDateSelect={handleDateSelect}
                onNavigate={navigateCalendar}
              />

              {selectedDate && (
                <div className="mt-5">
                  <TimeSlotPicker
                    slots={slots}
                    loading={slotsLoading}
                    selectedSlot={selectedSlot}
                    labels={{
                      selectTime: t.selectTime,
                      loadingSlots: t.loadingSlots,
                      noSlots: t.noSlots,
                    }}
                    onSlotSelect={setSelectedSlot}
                  />
                </div>
              )}

              {expert.timezone && (
                <p className="text-[10px] text-ink-300 mt-4">
                  {t.timezone}: {expert.timezone}
                </p>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="rounded-xl border-[2.5px] border-[#141418] p-6 sticky top-24 shadow-retro">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-1">
                {t.sessionPrice}
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-display font-bold text-ink-900">{priceTND}</span>
                <span className="text-sm text-ink-400">{dict.common.tnd}</span>
              </div>
              <p className="text-xs text-ink-400 mb-5">
                {expert.sessionDurationMinutes} min &middot; {t.perSession}
              </p>

              <Button
                variant="brand"
                className="w-full"
                size="lg"
                disabled={!selectedSlot}
                onClick={handleContinueToConfirm}
              >
                {selectedSlot
                  ? `${t.bookNow} — ${formatTime(selectedSlot.startTime)}`
                  : t.bookNow}
              </Button>

              {selectedSlot && selectedDate && (
                <div className="mt-3 rounded-lg bg-ink-50 p-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-400">{t.date}</span>
                    <span className="text-ink-700">{formatDate(selectedDate, lang)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-400">{t.time}</span>
                    <span className="text-ink-700">
                      {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-5 space-y-3">
                {[
                  { icon: Shield, text: t.refundPolicy },
                  { icon: Clock, text: t.escrow },
                  { icon: Video, text: t.videoCall },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <Icon size={14} className="text-ink-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-ink-500">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileHeader({ expert, t }: { expert: ExpertProfile; t: Dictionary['expertProfile'] }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB088] to-[#C4B5FD] flex items-center justify-center text-2xl font-bold text-[#141418] shrink-0 border-[2.5px] border-[#141418]">
        {expert.avatarUrl ? (
          <img
            src={expert.avatarUrl}
            alt={`${expert.firstName} ${expert.lastName}`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          expert.firstName.charAt(0).toUpperCase()
        )}
      </div>
      <div>
        <h1 className="text-2xl font-display font-bold text-ink-900">
          {expert.firstName} {expert.lastName}
        </h1>
        {expert.headline && (
          <p className="text-sm text-ink-500 mt-0.5">{expert.headline}</p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant="success">
            <CheckCircle2 size={10} />
            {t.verified}
          </Badge>
          {Number(expert.averageRating) > 0 && (
            <Badge variant="warning">
              <Star size={10} fill="currentColor" stroke="none" />
              {Number(expert.averageRating).toFixed(1)} ({expert.totalSessions} {t.sessions})
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
