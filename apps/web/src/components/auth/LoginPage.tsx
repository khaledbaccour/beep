'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';
import { loginUser } from '@/lib/api';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function LoginPage({ dict, lang }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('beep_token', res.data.accessToken);
      localStorage.setItem('beep_user', JSON.stringify(res.data.user));
      setSuccess(`Logged in as ${res.data.user.firstName} ${res.data.user.lastName} (${res.data.user.role})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
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
          <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">{dict.auth.loginTitle}</h1>
          <p className="text-sm text-ink-500">{dict.auth.loginSubtitle}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" data-testid="login-error">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700" data-testid="login-success">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.email}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              data-testid="login-email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.password}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              data-testid="login-password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-ink-500 cursor-pointer">
              <input type="checkbox" className="rounded border-ink-300" />
              {dict.auth.rememberMe}
            </label>
            <a href="#" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
              {dict.auth.forgotPassword}
            </a>
          </div>

          <Button variant="brand" size="lg" type="submit" className="w-full" disabled={loading} data-testid="login-submit">
            {loading ? '...' : dict.auth.loginButton}
          </Button>
        </form>

        <p className="text-sm text-ink-500 text-center mt-6">
          {dict.auth.noAccount}{' '}
          <a href={localePath(lang, '/register')} className="font-medium text-brand-500 hover:text-brand-600 transition-colors">
            {dict.auth.signUp}
          </a>
        </p>
      </div>
    </main>
  );
}
