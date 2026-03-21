'use client';

import { Clock } from 'lucide-react';
import type { SessionOption } from '@/lib/api';

interface DurationPickerProps {
  options: SessionOption[];
  selected: SessionOption | null;
  onSelect: (option: SessionOption) => void;
  label?: string;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatOptionPrice(millimes: number): string {
  const tnd = millimes / 1000;
  return tnd % 1 === 0 ? String(tnd) : tnd.toFixed(1);
}

export function DurationPicker({ options, selected, onSelect, label }: DurationPickerProps) {
  const sorted = [...options].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      {label && (
        <p className="text-xs font-bold text-ink-600 uppercase tracking-wider mb-3">
          {label}
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sorted.map((opt) => {
          const isSelected = selected?.id === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt)}
              className={`
                relative p-4 rounded-xl border-[2.5px] text-left transition-all duration-200
                ${isSelected
                  ? 'border-ink-900 bg-peach-100 shadow-retro-sm'
                  : 'border-ink-200 bg-white hover:border-ink-400'
                }
              `}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={12} className="text-ink-400" />
                <span className="text-sm font-bold text-ink-900">
                  {formatDuration(opt.durationMinutes)}
                </span>
              </div>
              <span className="text-lg font-display font-bold text-ink-900">
                {formatOptionPrice(opt.priceMillimes)} TND
              </span>
              {opt.label && (
                <p className="text-xs text-ink-500 mt-1">{opt.label}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
