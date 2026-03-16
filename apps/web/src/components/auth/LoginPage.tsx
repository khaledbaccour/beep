'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/i18n-utils';

interface Props {
  dict: Dictionary;
  lang: Locale;
}

export function LoginPage({ dict, lang }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm mx-auto px-4">
        {/* Logo */}
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

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.email}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.password}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

          <Button variant="brand" size="lg" type="submit" className="w-full">
            {dict.auth.loginButton}
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
