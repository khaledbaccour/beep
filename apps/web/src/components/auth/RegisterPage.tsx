'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';
import { registerUser } from '@/lib/api';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function RegisterPage({ dict, lang }: Props) {
  const [role, setRole] = useState<'CLIENT' | 'EXPERT'>('CLIENT');
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
      const res = await registerUser({ email, password, firstName, lastName, role, phone: phone || undefined });
      localStorage.setItem('beep_token', res.data.accessToken);
      localStorage.setItem('beep_user', JSON.stringify(res.data.user));
      setSuccess(`Account created for ${res.data.user.firstName} (${res.data.user.role})`);
      const dest = res.data.user.role === 'EXPERT' ? '/dashboard' : '/marketplace';
      setTimeout(() => router.push(localePath(lang, dest)), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white py-16">
      <div className="w-full max-w-sm mx-auto px-4">
        <a href={localePath(lang, '/')} className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-md bg-ink-900 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">b</span>
          </div>
          <span className="text-[17px] font-display font-bold text-ink-900">
            beep<span className="text-brand-500">.tn</span>
          </span>
        </a>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">{dict.auth.registerTitle}</h1>
          <p className="text-sm text-ink-500">{dict.auth.registerSubtitle}</p>
        </div>

        <div className="flex gap-1 p-1 rounded-lg bg-ink-50 border border-ink-100 mb-6">
          {(['CLIENT', 'EXPERT'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                role === r
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-400 hover:text-ink-600'
              }`}
            >
              {r === 'CLIENT' ? dict.auth.needExpert : dict.auth.amExpert}
            </button>
          ))}
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
            <Input type="tel" placeholder="+216 XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} data-testid="register-phone" />
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
