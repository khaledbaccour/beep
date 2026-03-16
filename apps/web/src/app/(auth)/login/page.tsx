'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
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
          <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">Welcome back</h1>
          <p className="text-sm text-ink-500">Log in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
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
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
              Forgot password?
            </a>
          </div>

          <Button variant="brand" size="lg" type="submit" className="w-full">
            Log in
          </Button>
        </form>

        <p className="text-sm text-ink-500 text-center mt-6">
          Don&apos;t have an account?{' '}
          <a href="/register" className="font-medium text-brand-500 hover:text-brand-600 transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
