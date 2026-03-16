import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getDaysArray, getLocaleString, isToday } from './utils';

const VISIBLE_DAYS = 7;

interface DatePickerProps {
  calendarStart: Date;
  selectedDate: Date | null;
  lang: string;
  labels: {
    selectDate: string;
  };
  onDateSelect: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function DatePicker({
  calendarStart,
  selectedDate,
  lang,
  labels,
  onDateSelect,
  onNavigate,
}: DatePickerProps) {
  const calendarDays = getDaysArray(calendarStart, VISIBLE_DAYS);
  const locale = getLocaleString(lang);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-display font-bold text-ink-900 flex items-center gap-2">
          <Calendar size={16} />
          {labels.selectDate}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => onNavigate('prev')}
            className="p-1.5 rounded-md border border-ink-200 hover:bg-ink-50 transition-colors disabled:opacity-30"
            disabled={isToday(calendarStart)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-1.5 rounded-md border border-ink-200 hover:bg-ink-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const isSelected = selectedDate?.toDateString() === day.toDateString();
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`flex flex-col items-center py-2.5 px-1 rounded-lg border-[2px] text-xs font-medium transition-all ${
                isSelected
                  ? 'border-[#141418] bg-[#FFB088] text-[#141418] shadow-retro-sm -translate-y-0.5'
                  : 'border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-ink-50'
              }`}
            >
              <span className="text-[10px] uppercase text-ink-400">
                {day.toLocaleDateString(locale, { weekday: 'short' })}
              </span>
              <span className="text-base font-bold mt-0.5">{day.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
