'use client';

import { Banknote, Smartphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TUNISIAN_BANKS, MOBILE_PROVIDERS } from '@beep/shared';

type PayoutMethod = 'BANK_TRANSFER' | 'MOBILE_MONEY';

interface StepPayoutData {
  payoutMethod: PayoutMethod;
  bankName: string;
  iban: string;
  accountHolderName: string;
  mobileProvider: string;
  mobilePhone: string;
}

interface StepPayoutProps {
  data: StepPayoutData;
  onChange: (data: StepPayoutData) => void;
  errors: Record<string, string>;
}

function formatIbanDisplay(raw: string): string {
  const cleaned = raw.replace(/\s/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

export function StepPayout({ data, onChange, errors }: StepPayoutProps) {
  function handleIbanChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    const cleaned = raw.replace(/\s/g, '').toUpperCase();
    const limited = cleaned.slice(0, 24);
    onChange({ ...data, iban: limited });
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const cleaned = val.replace(/[^\d+]/g, '');
    onChange({ ...data, mobilePhone: cleaned });
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const cleaned = val.replace(/[^a-zA-Z\u00C0-\u024F\s\-']/g, '');
    onChange({ ...data, accountHolderName: cleaned });
  }

  return (
    <div className="space-y-6">
      {/* Method selector */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-3">
          Payout Method *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...data, payoutMethod: 'BANK_TRANSFER' })}
            className={`
              p-4 rounded-xl border-[2.5px] text-left transition-all duration-200 flex items-start gap-3
              ${data.payoutMethod === 'BANK_TRANSFER'
                ? 'border-ink-900 bg-peach-50 shadow-retro-sm'
                : 'border-ink-200 bg-white hover:border-ink-400'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center shrink-0
              ${data.payoutMethod === 'BANK_TRANSFER' ? 'bg-peach-500' : 'bg-cream-200'}
            `}>
              <Banknote size={20} className={data.payoutMethod === 'BANK_TRANSFER' ? 'text-ink-900' : 'text-ink-500'} />
            </div>
            <div>
              <p className="font-bold text-sm text-ink-900">Bank Transfer</p>
              <p className="text-xs text-ink-500 mt-0.5">Receive payments to your bank account</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...data, payoutMethod: 'MOBILE_MONEY' })}
            className={`
              p-4 rounded-xl border-[2.5px] text-left transition-all duration-200 flex items-start gap-3
              ${data.payoutMethod === 'MOBILE_MONEY'
                ? 'border-ink-900 bg-brand-50 shadow-retro-sm'
                : 'border-ink-200 bg-white hover:border-ink-400'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center shrink-0
              ${data.payoutMethod === 'MOBILE_MONEY' ? 'bg-brand-500' : 'bg-cream-200'}
            `}>
              <Smartphone size={20} className={data.payoutMethod === 'MOBILE_MONEY' ? 'text-white' : 'text-ink-500'} />
            </div>
            <div>
              <p className="font-bold text-sm text-ink-900">Mobile Money</p>
              <p className="text-xs text-ink-500 mt-0.5">Receive payments via mobile wallet</p>
            </div>
          </button>
        </div>
      </div>

      {/* Bank Transfer fields */}
      {data.payoutMethod === 'BANK_TRANSFER' && (
        <div className="space-y-4 p-4 rounded-xl border-2 border-ink-100 bg-cream-50">
          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
              Account Holder Name *
            </label>
            <Input
              value={data.accountHolderName}
              onChange={handleNameChange}
              placeholder="Full name as it appears on your account"
              className="border-2 border-ink-200 rounded-xl"
              maxLength={100}
            />
            <p className="mt-1 text-xs text-ink-400">Letters, spaces, hyphens and apostrophes only</p>
            {errors.accountHolderName && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.accountHolderName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
              Bank Name *
            </label>
            <select
              value={data.bankName}
              onChange={(e) => onChange({ ...data, bankName: e.target.value })}
              className="flex h-11 w-full rounded-xl border-2 border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 font-medium transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100"
            >
              <option value="">Select your bank</option>
              {TUNISIAN_BANKS.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
            {errors.bankName && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.bankName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
              IBAN *
            </label>
            <Input
              value={formatIbanDisplay(data.iban)}
              onChange={handleIbanChange}
              placeholder="TN59 XXXX XXXX XXXX XXXX XXXX"
              className="border-2 border-ink-200 rounded-xl font-mono"
              maxLength={29}
            />
            <p className="mt-1 text-xs text-ink-400">
              Tunisian IBAN: TN59 followed by 20 digits ({data.iban.length}/24 characters)
            </p>
            {errors.iban && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.iban}</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Money fields */}
      {data.payoutMethod === 'MOBILE_MONEY' && (
        <div className="space-y-4 p-4 rounded-xl border-2 border-ink-100 bg-cream-50">
          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
              Provider *
            </label>
            <select
              value={data.mobileProvider}
              onChange={(e) => onChange({ ...data, mobileProvider: e.target.value })}
              className="flex h-11 w-full rounded-xl border-2 border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 font-medium transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100"
            >
              <option value="">Select provider</option>
              {MOBILE_PROVIDERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.mobileProvider && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.mobileProvider}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
              Phone Number *
            </label>
            <Input
              type="tel"
              value={data.mobilePhone}
              onChange={handlePhoneChange}
              placeholder="+216XXXXXXXX"
              className="border-2 border-ink-200 rounded-xl font-mono"
              maxLength={12}
            />
            <p className="mt-1 text-xs text-ink-400">Tunisian number: +216 followed by 8 digits</p>
            {errors.mobilePhone && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.mobilePhone}</p>
            )}
          </div>
        </div>
      )}

      {/* Note */}
      <div className="p-4 rounded-xl border-2 border-peach-300 bg-peach-50">
        <p className="text-sm font-medium text-ink-700">
          Payments will be processed manually and sent to your account after each completed session.
          You will receive your payout within 3-5 business days.
        </p>
      </div>
    </div>
  );
}

export type { StepPayoutData };
