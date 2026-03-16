'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden bg-ink-900 p-10 sm:p-16">
          {/* Subtle pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Coral accent glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px]" />

          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-base sm:text-lg text-ink-400 mb-8 leading-relaxed">
              Whether you need expert guidance or want to share your knowledge &mdash; Beep connects you in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="bg-brand-500 text-white hover:bg-brand-600 shadow-warm hover:shadow-warm-lg"
                asChild
              >
                <a href="/register">
                  Create free account
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-ink-600 text-ink-300 hover:text-white hover:bg-ink-800 hover:border-ink-500"
                asChild
              >
                <a href="/marketplace">Browse experts</a>
              </Button>
            </div>

            <p className="mt-8 text-xs text-ink-500">
              No credit card required &middot; Free for clients &middot; Experts pay only when they earn
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
