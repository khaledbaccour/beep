'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Dictionary } from '@/i18n/types';

export interface SessionOptionRow {
  durationMinutes: number;
  priceEUR: string;
  label: string;
}

export interface StepPricingData {
  sessionOptions: SessionOptionRow[];
  timezone: string;
}

interface StepPricingProps {
  data: StepPricingData;
  onChange: (data: StepPricingData) => void;
  errors: Record<string, string>;
  dict: Dictionary;
}

const DURATION_CHOICES = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
  { value: 120, label: '120 min' },
];

const POPULAR_TIMEZONES = [
  'Europe/Paris',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Madrid',
  'America/New_York',
  'Asia/Dubai',
];

const MAX_OPTIONS = 6;

export function StepPricing({ data, onChange, errors, dict }: StepPricingProps) {
  const options = data.sessionOptions;

  function updateOption(index: number, patch: Partial<SessionOptionRow>) {
    const updated = options.map((opt, i) => (i === index ? { ...opt, ...patch } : opt));
    onChange({ ...data, sessionOptions: updated });
  }

  function addOption() {
    if (options.length >= MAX_OPTIONS) return;
    onChange({
      ...data,
      sessionOptions: [
        ...options,
        { durationMinutes: 60, priceEUR: '', label: '' },
      ],
    });
  }

  function removeOption(index: number) {
    if (options.length <= 1) return;
    onChange({
      ...data,
      sessionOptions: options.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="space-y-6">
      {/* Session options */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-3">
          {dict.onboarding.sessionPrice || 'Session Options'}
        </label>

        <div className="space-y-4">
          {options.map((opt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border-[2.5px] border-ink-200 bg-white space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-500 uppercase">
                  Option {idx + 1}
                </span>
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="p-1.5 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Duration dropdown */}
                <div>
                  <label className="block text-xs text-ink-500 mb-1">
                    {dict.onboarding.sessionDuration || 'Duration'}
                  </label>
                  <select
                    value={opt.durationMinutes}
                    onChange={(e) =>
                      updateOption(idx, { durationMinutes: parseInt(e.target.value, 10) })
                    }
                    className="flex h-11 w-full rounded-xl border-2 border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 font-medium transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100"
                  >
                    {DURATION_CHOICES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price input */}
                <div>
                  <label className="block text-xs text-ink-500 mb-1">
                    {dict.onboarding.sessionPrice || 'Price'}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      max="9999"
                      step="0.5"
                      value={opt.priceEUR}
                      onChange={(e) => updateOption(idx, { priceEUR: e.target.value })}
                      placeholder="50"
                      className="border-2 border-ink-200 rounded-xl pr-14"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-400">
                      EUR
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional label */}
              <div>
                <label className="block text-xs text-ink-500 mb-1">
                  Label (optional)
                </label>
                <Input
                  value={opt.label}
                  onChange={(e) => updateOption(idx, { label: e.target.value })}
                  placeholder="e.g. Quick consultation, Full session..."
                  className="border-2 border-ink-200 rounded-xl"
                  maxLength={60}
                />
              </div>

              {errors[`option_${idx}`] && (
                <p className="text-xs font-medium text-red-500">{errors[`option_${idx}`]}</p>
              )}
            </div>
          ))}
        </div>

        {options.length < MAX_OPTIONS && (
          <Button
            type="button"
            variant="ghost"
            onClick={addOption}
            className="mt-3 rounded-xl text-sm text-ink-500 hover:text-ink-700"
          >
            <Plus size={16} />
            Add option
          </Button>
        )}

        {errors.sessionOptions && (
          <p className="mt-1 text-xs font-medium text-red-500">{errors.sessionOptions}</p>
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
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-ink-400">{dict.onboarding.timezoneHelp}</p>
        {errors.timezone && (
          <p className="mt-1 text-xs font-medium text-red-500">{errors.timezone}</p>
        )}
      </div>

      {/* Summary card */}
      {options.some((o) => o.priceEUR && parseFloat(o.priceEUR) > 0) && (
        <div className="p-4 rounded-xl border-[2.5px] border-ink-900 bg-cream-50 shadow-retro-sm">
          <p className="text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
            {dict.onboarding.sessionSummary}
          </p>
          <div className="space-y-2">
            {options
              .filter((o) => o.priceEUR && parseFloat(o.priceEUR) > 0)
              .map((o, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-ink-600">
                    {o.durationMinutes}
                    {dict.onboarding.minuteSession}
                    {o.label ? ` — ${o.label}` : ''}
                  </span>
                  <span className="text-lg font-bold text-ink-900">
                    {parseFloat(o.priceEUR).toFixed(2)} EUR
                  </span>
                </div>
              ))}
          </div>
          <div className="mt-2 text-xs text-ink-400">
            {dict.onboarding.timezoneLabel}: {data.timezone}
          </div>
        </div>
      )}
    </div>
  );
}
