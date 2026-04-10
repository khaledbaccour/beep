'use client';

import { Banknote } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/i18n/types';

interface StepPayoutData {
  payoutMethod: 'BANK_TRANSFER';
  iban: string;
  accountHolderName: string;
}

interface StepPayoutProps {
  data: StepPayoutData;
  onChange: (data: StepPayoutData) => void;
  errors: Record<string, string>;
  dict: Dictionary;
}

function formatIbanDisplay(raw: string): string {
  const cleaned = raw.replace(/\s/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

export function StepPayout({ data, onChange, errors, dict }: StepPayoutProps) {
  function handleIbanChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    const cleaned = raw.replace(/\s/g, '').toUpperCase();
    const limited = cleaned.slice(0, 27);
    onChange({ ...data, iban: limited });
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const cleaned = val.replace(/[^a-zA-Z\u00C0-\u024F\s\-']/g, '');
    onChange({ ...data, accountHolderName: cleaned });
  }

  return (
    <div className="space-y-6">
      {/* Payout method header */}
      <div className="p-4 rounded-xl border-[2.5px] border-ink-900 bg-peach-50 shadow-retro-sm flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-peach-500">
          <Banknote size={20} className="text-ink-900" />
        </div>
        <div>
          <p className="font-bold text-sm text-ink-900">{dict.onboarding.bankTransfer}</p>
          <p className="text-xs text-ink-500 mt-0.5">{dict.onboarding.bankTransferDesc}</p>
        </div>
      </div>

      {/* Bank Transfer fields */}
      <div className="space-y-4 p-4 rounded-xl border-2 border-ink-100 bg-cream-50">
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
            {dict.onboarding.accountHolder}
          </label>
          <Input
            value={data.accountHolderName}
            onChange={handleNameChange}
            placeholder={dict.onboarding.accountHolderPlaceholder}
            className="border-2 border-ink-200 rounded-xl"
            maxLength={100}
          />
          <p className="mt-1 text-xs text-ink-400">{dict.onboarding.nameHelp}</p>
          {errors.accountHolderName && (
            <p className="mt-1 text-xs font-medium text-red-500">{errors.accountHolderName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
            {dict.onboarding.ibanRib}
          </label>
          <Input
            value={formatIbanDisplay(data.iban)}
            onChange={handleIbanChange}
            placeholder="FR76 3000 6000 0112 3456 7890 189"
            className="border-2 border-ink-200 rounded-xl font-mono"
            maxLength={33}
          />
          <p className="mt-1 text-xs text-ink-400">
            {dict.onboarding.ibanHelp} ({data.iban.length}/27 {dict.onboarding.characters})
          </p>
          {errors.iban && (
            <p className="mt-1 text-xs font-medium text-red-500">{errors.iban}</p>
          )}
        </div>
      </div>

      {/* Note */}
      <div className="p-4 rounded-xl border-2 border-peach-300 bg-peach-50">
        <p className="text-sm font-medium text-ink-700">
          {dict.onboarding.payoutNote}
        </p>
      </div>
    </div>
  );
}

export type { StepPayoutData };
