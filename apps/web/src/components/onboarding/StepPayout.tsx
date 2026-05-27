'use client';

import { Banknote, Smartphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/i18n/types';

interface StepPayoutData {
  payoutMethod: 'BANK_TRANSFER' | 'UPI';
  accountHolderName: string;
  ifscCode: string;
  accountNumber: string;
  upiId: string;
}

interface StepPayoutProps {
  data: StepPayoutData;
  onChange: (data: StepPayoutData) => void;
  errors: Record<string, string>;
  dict: Dictionary;
}

export function StepPayout({ data, onChange, errors, dict }: StepPayoutProps) {
  function handleIfscChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = e.target.value.replace(/\s/g, '').toUpperCase().slice(0, 11);
    onChange({ ...data, ifscCode: cleaned });
  }

  function handleAccountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 18);
    onChange({ ...data, accountNumber: digits });
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const cleaned = val.replace(/[^a-zA-ZÀ-ɏ\s\-']/g, '');
    onChange({ ...data, accountHolderName: cleaned });
  }

  function handleUpiChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...data, upiId: e.target.value.trim() });
  }

  return (
    <div className="space-y-6">
      {/* Payout method selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange({ ...data, payoutMethod: 'BANK_TRANSFER' })}
          className={`p-4 rounded-xl border-[2.5px] text-left transition-all ${
            data.payoutMethod === 'BANK_TRANSFER'
              ? 'border-ink-900 bg-peach-50 shadow-retro-sm'
              : 'border-ink-200 bg-white hover:border-ink-400'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-peach-500 flex items-center justify-center">
              <Banknote size={14} className="text-ink-900" />
            </div>
            <p className="font-bold text-sm text-ink-900">{dict.onboarding.bankTransfer}</p>
          </div>
          <p className="text-xs text-ink-500">{dict.onboarding.bankTransferDesc}</p>
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...data, payoutMethod: 'UPI' })}
          className={`p-4 rounded-xl border-[2.5px] text-left transition-all ${
            data.payoutMethod === 'UPI'
              ? 'border-ink-900 bg-peach-50 shadow-retro-sm'
              : 'border-ink-200 bg-white hover:border-ink-400'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Smartphone size={14} className="text-white" />
            </div>
            <p className="font-bold text-sm text-ink-900">{dict.onboarding.upiMethod}</p>
          </div>
          <p className="text-xs text-ink-500">{dict.onboarding.upiMethodDesc}</p>
        </button>
      </div>

      {/* Bank Transfer fields */}
      {data.payoutMethod === 'BANK_TRANSFER' && (
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
              value={data.ifscCode}
              onChange={handleIfscChange}
              placeholder={dict.onboarding.ibanRibPlaceholder}
              className="border-2 border-ink-200 rounded-xl font-mono uppercase"
              maxLength={11}
            />
            <p className="mt-1 text-xs text-ink-400">
              {dict.onboarding.ibanHelp} ({data.ifscCode.length}/11 {dict.onboarding.characters})
            </p>
            {errors.ifscCode && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.ifscCode}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
              {dict.onboarding.accountNumber}
            </label>
            <Input
              value={data.accountNumber}
              onChange={handleAccountChange}
              placeholder={dict.onboarding.accountNumberPlaceholder}
              className="border-2 border-ink-200 rounded-xl font-mono"
              maxLength={18}
            />
            {errors.accountNumber && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.accountNumber}</p>
            )}
          </div>
        </div>
      )}

      {/* UPI fields */}
      {data.payoutMethod === 'UPI' && (
        <div className="space-y-4 p-4 rounded-xl border-2 border-ink-100 bg-cream-50">
          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
              {dict.onboarding.upiId}
            </label>
            <Input
              value={data.upiId}
              onChange={handleUpiChange}
              placeholder={dict.onboarding.upiIdPlaceholder}
              className="border-2 border-ink-200 rounded-xl font-mono"
              maxLength={64}
            />
            <p className="mt-1 text-xs text-ink-400">{dict.onboarding.upiIdHelp}</p>
            {errors.upiId && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.upiId}</p>
            )}
          </div>
        </div>
      )}

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
