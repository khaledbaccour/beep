'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [role, setRole] = useState<'CLIENT' | 'EXPERT'>('CLIENT');

  return (
    <main className="min-h-screen flex items-center justify-center bg-white py-16">
      <div className="w-full max-w-sm mx-auto px-4">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-md bg-ink-900 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">b</span>
          </div>
          <span className="text-[17px] font-display font-bold text-ink-900">
            beep<span className="text-brand-500">.tn</span>
          </span>
        </a>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">Create your account</h1>
          <p className="text-sm text-ink-500">Join Beep and start connecting</p>
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
              {r === 'CLIENT' ? 'I need an expert' : 'I am an expert'}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">First name</label>
              <Input type="text" placeholder="Ahmed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Last name</label>
              <Input type="text" placeholder="Ben Ali" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
            <Input type="password" placeholder="8+ characters" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Phone</label>
            <Input type="tel" placeholder="+216 XX XXX XXX" />
          </div>

          <Button variant="brand" size="lg" type="submit" className="w-full">
            Create account
          </Button>
        </form>

        <p className="text-xs text-ink-400 text-center mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>

        <p className="text-sm text-ink-500 text-center mt-6">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-brand-500 hover:text-brand-600 transition-colors">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
