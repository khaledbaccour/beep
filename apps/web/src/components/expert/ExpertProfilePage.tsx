'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle2, Clock, Video, Shield } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import type { Locale } from '@/i18n';

interface ExpertProfilePageProps {
  slug: string;
  dict: Dictionary;
  lang: Locale;
}

export function ExpertProfilePage({ slug, dict, lang }: ExpertProfilePageProps) {
  return (
    <section className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Profile */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                {slug.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-ink-900">{slug}</h1>
                <p className="text-sm text-ink-500 mt-0.5">{slug}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success">
                    <CheckCircle2 size={10} />
                    {dict.expertProfile.verified}
                  </Badge>
                  <Badge variant="warning">
                    <Star size={10} fill="currentColor" stroke="none" />
                    4.9 (128 {dict.expertProfile.reviews})
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-sm text-ink-600 leading-relaxed mb-8">
              {dict.expertProfile.description}
            </p>

            {/* Schedule */}
            <div className="border border-ink-200/60 rounded-xl p-5">
              <h2 className="text-base font-display font-bold text-ink-900 mb-4">{dict.expertProfile.availableTimes}</h2>
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                  <div key={day} className="flex items-center gap-4">
                    <span className="text-xs text-ink-400 w-20 font-medium">{day}</span>
                    <div className="flex gap-2 flex-wrap">
                      {[`${9 + i % 3}:00`, `${11 + i % 2}:00`, `${14 + i % 3}:00`, `${16 + i % 2}:00`].map((time) => (
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
          </div>

          {/* Right: Booking card */}
          <div className="lg:w-72 shrink-0">
            <div className="rounded-xl border border-ink-200/60 p-6 sticky top-24 shadow-card">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-1">{dict.expertProfile.sessionPrice}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-display font-bold text-ink-900">45</span>
                <span className="text-sm text-ink-400">{dict.common.tnd}</span>
              </div>
              <p className="text-xs text-ink-400 mb-5">{dict.expertProfile.duration}</p>

              <Button variant="brand" className="w-full" size="lg">
                {dict.expertProfile.bookNow}
              </Button>

              <div className="mt-5 space-y-3">
                {[
                  { icon: Shield, text: dict.expertProfile.refundPolicy },
                  { icon: Clock, text: dict.expertProfile.escrow },
                  { icon: Video, text: dict.expertProfile.videoCall },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <Icon size={14} className="text-ink-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-ink-500">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
