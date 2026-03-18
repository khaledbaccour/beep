'use client';

import { Video, Clock } from 'lucide-react';
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

const STATUS_STYLES: Record<BookingStatus, { border: string; bg: string; text: string; dot: string }> = {
  CONFIRMED: { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  COMPLETED: { border: 'border-blue-300', bg: 'bg-blue-50', text: 'text-blue-800', dot: 'bg-blue-500' },
  PENDING_PAYMENT: { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
  IN_PROGRESS: { border: 'border-violet-300', bg: 'bg-violet-50', text: 'text-violet-800', dot: 'bg-violet-500' },
  CANCELLED_BY_CLIENT: { border: 'border-red-300', bg: 'bg-red-50', text: 'text-red-800', dot: 'bg-red-500' },
  CANCELLED_BY_EXPERT: { border: 'border-red-300', bg: 'bg-red-50', text: 'text-red-800', dot: 'bg-red-500' },
  NO_SHOW: { border: 'border-ink-300', bg: 'bg-ink-50', text: 'text-ink-800', dot: 'bg-ink-400' },
  DISPUTED: { border: 'border-orange-300', bg: 'bg-orange-50', text: 'text-orange-800', dot: 'bg-orange-500' },
};

const STATUS_FALLBACK = { border: 'border-ink-200', bg: 'bg-ink-50', text: 'text-ink-600', dot: 'bg-ink-400' };

export function BookingRow({ booking, d, lang, isExpert }: BookingRowProps) {
  const start = new Date(booking.scheduledStartTime);
  const end = new Date(booking.scheduledEndTime);

  const localeTag = lang === 'ar' ? 'ar-TN' : lang === 'en' ? 'en-US' : 'fr-TN';
  const dateStr = start.toLocaleDateString(localeTag, {
    weekday: 'short', month: 'short', day: 'numeric',
  });
  const timeStr = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const isUpcoming = start > new Date() && booking.status === 'CONFIRMED';
  const style = STATUS_STYLES[booking.status] ?? STATUS_FALLBACK;

  const initials = (isExpert ? booking.clientName : booking.expertName)
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border-2 border-ink-200/80 bg-cream-50/40 hover:border-ink-300 hover:bg-cream-50 transition-all group">
      {/* Avatar + name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg border-2 border-ink-900 bg-gradient-to-br from-brand-200 to-peach-200 flex items-center justify-center shrink-0">
          <span className="text-[11px] font-bold text-ink-900">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink-900 truncate">
            {isExpert ? booking.clientName : booking.expertName}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-ink-400 mt-0.5">
            <Clock size={10} />
            <span>{dateStr} &middot; {timeStr}</span>
          </div>
        </div>
      </div>

      {/* Amount + status + join */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-sm font-bold text-ink-900 tabular-nums">
          {millimesToTND(booking.amountMillimes)} <span className="text-[10px] font-bold text-ink-400">TND</span>
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${style.border} ${style.bg} ${style.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {booking.status.replace(/_/g, ' ')}
        </span>
        {isUpcoming && booking.sessionRoomId && (
          <a
            href={localePath(lang, `/session/${booking.sessionRoomId}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-ink-900 text-white border-2 border-ink-900 shadow-retro-sm hover:-translate-y-0.5 hover:shadow-retro transition-all"
          >
            <Video size={12} />
            {d.joinCall}
          </a>
        )}
      </div>
    </div>
  );
}
