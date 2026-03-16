'use client';

import { Video } from 'lucide-react';
import type { Locale } from '@/i18n';
import type { Dictionary } from '@/i18n/types';
import { localePath } from '@/lib/i18n-utils';
import type { BookingResponse, BookingStatus } from '@/lib/api';
import { millimesToTND } from './types';

interface BookingRowProps {
  booking: BookingResponse;
  d: Dictionary['dashboard'];
  lang: Locale;
  isExpert: boolean;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  CONFIRMED: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  COMPLETED: 'border-blue-300 bg-blue-50 text-blue-800',
  PENDING_PAYMENT: 'border-amber-300 bg-amber-50 text-amber-800',
  IN_PROGRESS: 'border-violet-300 bg-violet-50 text-violet-800',
  CANCELLED_BY_CLIENT: 'border-red-300 bg-red-50 text-red-800',
  CANCELLED_BY_EXPERT: 'border-red-300 bg-red-50 text-red-800',
  NO_SHOW: 'border-ink-300 bg-ink-50 text-ink-800',
  DISPUTED: 'border-orange-300 bg-orange-50 text-orange-800',
};

export function BookingRow({ booking, d, lang, isExpert }: BookingRowProps) {
  const start = new Date(booking.scheduledStartTime);
  const end = new Date(booking.scheduledEndTime);

  const localeTag = lang === 'ar' ? 'ar-TN' : lang === 'en' ? 'en-US' : 'fr-TN';
  const dateStr = start.toLocaleDateString(localeTag, {
    weekday: 'short', month: 'short', day: 'numeric',
  });
  const timeStr = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const isUpcoming = start > new Date() && booking.status === 'CONFIRMED';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-ink-200/60 bg-cream-50/50">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 truncate">
          {isExpert ? booking.clientName : booking.expertName}
        </p>
        <p className="text-xs text-ink-400 mt-0.5">{dateStr} &middot; {timeStr}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-ink-900">
          {millimesToTND(booking.amountMillimes)} TND
        </span>
        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${STATUS_STYLES[booking.status] ?? 'border-ink-200 bg-ink-50 text-ink-600'}`}>
          {booking.status.replace(/_/g, ' ')}
        </span>
        {isUpcoming && booking.sessionRoomId && (
          <a
            href={localePath(lang, `/session/${booking.sessionRoomId}`)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-ink-900 text-white hover:-translate-y-0.5 transition-transform"
          >
            <Video size={12} />
            {d.joinCall}
          </a>
        )}
      </div>
    </div>
  );
}
