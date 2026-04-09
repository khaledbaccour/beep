'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath, translateError } from '@/lib/i18n-utils';
import { registerUser } from '@/lib/api';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function RegisterPage({ dict, lang }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await registerUser({ email, password, firstName, lastName, phone: phone ? `+216${phone}` : undefined });
      localStorage.setItem('beep_token', res.data.accessToken);
      localStorage.setItem('beep_user', JSON.stringify(res.data.user));
      setSuccess(dict.auth.accountCreated);
      router.push(localePath(lang, '/choose-path'));
    } catch (err) {
      setError(err instanceof Error ? translateError(err.message, dict) : dict.apiErrors.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white py-16">
      <div className="w-full max-w-sm mx-auto px-4">
        <a href={localePath(lang, '/')} className="flex items-center justify-center gap-1.5 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Beep" className="w-8 h-8" />
          <span className="text-[17px] font-body font-bold text-ink-900">
            beep<span className="text-brand-500">.tn</span>
          </span>
        </a>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">{dict.auth.registerTitle}</h1>
          <p className="text-sm text-ink-500">{dict.auth.registerSubtitle}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" data-testid="register-error">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700" data-testid="register-success">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.firstName}</label>
              <Input type="text" placeholder="Ahmed" value={firstName} onChange={(e) => setFirstName(e.target.value)} required data-testid="register-firstName" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.lastName}</label>
              <Input type="text" placeholder="Ben Ali" value={lastName} onChange={(e) => setLastName(e.target.value)} required data-testid="register-lastName" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.email}</label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="register-email" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.password}</label>
            <Input type="password" placeholder={dict.auth.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} data-testid="register-password" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.phone}</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-ink-200 bg-ink-50 text-sm text-ink-500">+216</span>
              <Input
                type="tel"
                placeholder="XX XXX XXX"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setPhone(digits);
                }}
                maxLength={8}
                className="rounded-l-none"
                data-testid="register-phone"
              />
            </div>
          </div>

          <Button variant="brand" size="lg" type="submit" className="w-full" disabled={loading} data-testid="register-submit">
            {loading ? '...' : dict.auth.createAccount}
          </Button>
        </form>

        <p className="text-xs text-ink-400 text-center mt-4">{dict.auth.termsNotice}</p>

        <p className="text-sm text-ink-500 text-center mt-6">
          {dict.auth.hasAccount}{' '}
          <a href={localePath(lang, '/login')} className="font-medium text-brand-500 hover:text-brand-600 transition-colors">
            {dict.auth.logIn}
          </a>
        </p>
      </div>
    </main>
  );
}
