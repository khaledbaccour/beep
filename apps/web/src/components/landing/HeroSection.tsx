'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, CheckCircle2, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="animate-fade-up opacity-0 mb-6">
            <Badge variant="brand" className="py-1 px-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              Now live in Tunisia
            </Badge>
          </div>

          {/* Headline - cal.com style: large, bold, single-purpose */}
          <h1 className="animate-fade-up opacity-0 stagger-1 text-[42px] sm:text-[56px] lg:text-[72px] font-display font-bold leading-[1.05] tracking-[-0.02em] text-ink-900">
            Scheduling for{' '}
            <span className="relative">
              <span className="text-brand-500">experts</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47 2 87 1 100 2.5c30 1.5 60 2.5 99 2" stroke="#FF6B54" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
            {' '}who{'\n'}mean business.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up opacity-0 stagger-2 mt-6 text-lg sm:text-xl text-ink-500 max-w-2xl leading-relaxed">
            Beep gives every professional in Tunisia a personal booking page.
            Clients find you, pick a time, pay securely, and join a video call &mdash; all in one place.
          </p>

          {/* CTA row */}
          <div className="animate-fade-up opacity-0 stagger-3 mt-10 flex flex-col sm:flex-row items-start gap-3">
            <Button variant="brand" size="lg" asChild>
              <a href="/register">
                Start for free
                <ArrowRight size={16} />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/marketplace">
                <Play size={14} className="text-ink-400" />
                Browse experts
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-up opacity-0 stagger-5 mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {['#FF6B54', '#10B981', '#5B8DEF', '#E07CCB', '#DDA15E'].map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {['Y', 'A', 'M', 'S', 'K'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-ink-500">500+ experts</span>
            </div>
            <div className="h-4 w-px bg-ink-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={13} fill="#F59E0B" stroke="none" />
                ))}
              </div>
              <span className="text-sm text-ink-500">4.9/5 from 8k+ reviews</span>
            </div>
            <div className="h-4 w-px bg-ink-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-success-500" />
              <span className="text-sm text-ink-500">Free for clients</span>
            </div>
          </div>
        </div>

        {/* Product preview - cal.com-style browser mockup */}
        <div className="animate-fade-up opacity-0 stagger-6 mt-16 lg:mt-20">
          <div className="rounded-xl border border-ink-200/80 bg-white shadow-elevated overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3 bg-ink-50/80 border-b border-ink-100">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-ink-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-ink-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-ink-200" />
              </div>
              <div className="flex-1 max-w-sm mx-auto">
                <div className="h-7 rounded-md bg-white border border-ink-100 flex items-center justify-center">
                  <span className="text-[11px] text-ink-400 font-mono tracking-tight">beep.tn/dr-amira</span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Expert info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-lg font-bold text-white shrink-0">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-display font-bold text-ink-900">Dr. Amira Ben Salem</h3>
                        <Badge variant="success" className="text-[10px]">
                          <CheckCircle2 size={10} />
                          Verified
                        </Badge>
                      </div>
                      <p className="text-sm text-ink-500 mt-0.5">Dermatologist &middot; Tunis</p>
                    </div>
                  </div>

                  {/* Time slots - cal.com style */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-ink-400 uppercase tracking-wider">Available this week</p>
                    {['Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
                      <div key={day} className="flex items-center gap-4">
                        <span className="text-xs text-ink-400 w-10 font-mono font-medium">{day}</span>
                        <div className="flex gap-2">
                          {[`${9 + i}:00`, `${10 + i}:00`, `${14 + i}:00`].map((time) => (
                            <button
                              key={time}
                              className="px-3 py-1.5 text-xs font-medium rounded-md border border-ink-200 text-ink-700 bg-white hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-ink-100" />

                {/* Booking card */}
                <div className="lg:w-64 shrink-0">
                  <div className="rounded-lg border border-ink-200 p-5">
                    <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-1">Session</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-display font-bold text-ink-900">45</span>
                      <span className="text-sm text-ink-400">TND</span>
                    </div>
                    <p className="text-xs text-ink-400">30 min video call</p>

                    <Button variant="brand" className="w-full mt-5" size="default">
                      Book session
                    </Button>

                    <div className="mt-4 space-y-2">
                      {['Full refund 24h+ before', 'Secure escrow payment', 'HD video, no downloads'].map((text) => (
                        <div key={text} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-success-500 shrink-0" />
                          <span className="text-[11px] text-ink-400">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
