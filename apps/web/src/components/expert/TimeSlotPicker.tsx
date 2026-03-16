import { Loader2 } from 'lucide-react';
import type { AvailableSlot } from '@/lib/api';
import { formatTime } from './utils';

interface TimeSlotPickerProps {
  slots: AvailableSlot[];
  loading: boolean;
  selectedSlot: AvailableSlot | null;
  labels: {
    selectTime: string;
    loadingSlots: string;
    noSlots: string;
  };
  onSlotSelect: (slot: AvailableSlot) => void;
}

export function TimeSlotPicker({
  slots,
  loading,
  selectedSlot,
  labels,
  onSlotSelect,
}: TimeSlotPickerProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-ink-900 mb-3">{labels.selectTime}</h3>
      {loading ? (
        <div className="flex items-center gap-2 text-ink-400 py-4">
          <Loader2 className="animate-spin" size={16} />
          <span className="text-xs">{labels.loadingSlots}</span>
        </div>
      ) : slots.length === 0 ? (
        <p className="text-xs text-ink-400 py-4">{labels.noSlots}</p>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.startTime === slot.startTime;
            return (
              <button
                key={slot.startTime}
                onClick={() => onSlotSelect(slot)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg border-[2px] transition-all ${
                  isSelected
                    ? 'border-[#141418] bg-[#FFB088] text-[#141418] shadow-retro-sm -translate-y-0.5'
                    : 'border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-ink-50'
                }`}
              >
                {formatTime(slot.startTime)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
