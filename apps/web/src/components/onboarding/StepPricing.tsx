'use client';

import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/i18n/types';

interface StepPricingData {
  priceTND: string;
  sessionDurationMinutes: number;
  timezone: string;
}

interface StepPricingProps {
  data: StepPricingData;
  onChange: (data: StepPricingData) => void;
  errors: Record<string, string>;
  dict: Dictionary;
}

const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
  { value: 90, label: '90 minutes' },
];

const POPULAR_TIMEZONES = [
  'Africa/Tunis',
  'Africa/Algiers',
  'Africa/Cairo',
  'Europe/Paris',
  'Europe/London',
  'America/New_York',
  'Asia/Dubai',
];

export function StepPricing({ data, onChange, errors, dict }: StepPricingProps) {
  return (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.sessionPrice}
        </label>
        <div className="relative w-48">
          <Input
            type="number"
            min="1"
            max="9999"
            step="0.5"
            value={data.priceTND}
            onChange={(e) => onChange({ ...data, priceTND: e.target.value })}
            placeholder="50"
            required
            className="border-2 border-ink-200 rounded-xl pr-14 text-lg font-bold"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-400">
            TND
          </span>
        </div>
        {data.priceTND && parseFloat(data.priceTND) > 0 && (
          <p className="mt-2 text-xs text-ink-500">
            {dict.onboarding.clientsWillPay} <span className="font-bold text-ink-900">{parseFloat(data.priceTND).toFixed(2)} TND</span> {dict.onboarding.perSession}
          </p>
        )}
        {errors.priceTND && <p className="mt-1 text-xs font-medium text-red-500">{errors.priceTND}</p>}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.sessionDuration}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...data, sessionDurationMinutes: opt.value })}
              className={`
                p-3 rounded-xl border-[2.5px] text-center transition-all duration-200
                ${data.sessionDurationMinutes === opt.value
                  ? 'border-ink-900 bg-peach-100 shadow-retro-sm font-bold text-ink-900'
                  : 'border-ink-200 bg-white hover:border-ink-400 text-ink-600'
                }
              `}
            >
              <span className="block text-lg font-bold">{opt.value}</span>
              <span className="block text-xs text-ink-500">{dict.onboarding.min}</span>
            </button>
          ))}
        </div>
        {errors.sessionDurationMinutes && (
          <p className="mt-1 text-xs font-medium text-red-500">{errors.sessionDurationMinutes}</p>
        )}
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.timezone}
        </label>
        <select
          value={data.timezone}
          onChange={(e) => onChange({ ...data, timezone: e.target.value })}
          className="flex h-11 w-full rounded-xl border-2 border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 font-mono transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100"
        >
          {POPULAR_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-ink-400">
          {dict.onboarding.timezoneHelp}
        </p>
        {errors.timezone && <p className="mt-1 text-xs font-medium text-red-500">{errors.timezone}</p>}
      </div>

      {/* Summary card */}
      {data.priceTND && parseFloat(data.priceTND) > 0 && (
        <div className="p-4 rounded-xl border-[2.5px] border-ink-900 bg-cream-50 shadow-retro-sm">
          <p className="text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{dict.onboarding.sessionSummary}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-600">{data.sessionDurationMinutes}{dict.onboarding.minuteSession}</span>
            <span className="text-lg font-bold text-ink-900">{parseFloat(data.priceTND).toFixed(2)} TND</span>
          </div>
          <div className="mt-1 text-xs text-ink-400">
            {dict.onboarding.timezoneLabel}: {data.timezone}
          </div>
        </div>
      )}
    </div>
  );
}

export type { StepPricingData };
