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

export function RegisterPage({ dict, lang }: Props) {
  const [role, setRole] = useState<'CLIENT' | 'EXPERT'>('CLIENT');

  return (
    <main className="min-h-screen flex items-center justify-center bg-white py-16">
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
          <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">{dict.auth.registerTitle}</h1>
          <p className="text-sm text-ink-500">{dict.auth.registerSubtitle}</p>
        </div>

        {/* Role toggle */}
        <div className="flex gap-1 p-1 rounded-lg bg-ink-50 border border-ink-100 mb-6">
          {(['CLIENT', 'EXPERT'] as const).map((r) => (
            <button
              key={r}
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

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.firstName}</label>
              <Input type="text" placeholder="Ahmed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.lastName}</label>
              <Input type="text" placeholder="Ben Ali" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.email}</label>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.password}</label>
            <Input type="password" placeholder={dict.auth.passwordPlaceholder} />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{dict.auth.phone}</label>
            <Input type="tel" placeholder="+216 XX XXX XXX" />
          </div>

          <Button variant="brand" size="lg" type="submit" className="w-full">
            {dict.auth.createAccount}
          </Button>
        </form>

        <p className="text-xs text-ink-400 text-center mt-4">
          {dict.auth.termsNotice}
        </p>

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
