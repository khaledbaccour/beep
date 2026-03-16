'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Saloua Mokadem',
    role: 'Client',
    text: 'I found an incredible English tutor on Beep in minutes. The video quality was perfect and booking was seamless. My IELTS score went from 6.0 to 7.5 in just 2 months!',
    initials: 'SM',
    gradient: 'from-pink-400 to-rose-400',
  },
  {
    name: 'Dr. Khalil Jebali',
    role: 'Expert, Cardiologist',
    text: 'As a doctor, I can now offer consultations beyond my clinic hours. Beep handles scheduling, payments, and video \u2014 I just focus on my patients. My income grew 40%.',
    initials: 'KJ',
    gradient: 'from-emerald-400 to-teal-400',
  },
  {
    name: 'Narimen Trabelsi',
    role: 'Client',
    text: 'The refund policy gives me confidence to try new experts. I booked a fitness coach, and when my schedule changed, the cancellation was instant and fair.',
    initials: 'NT',
    gradient: 'from-violet-400 to-purple-400',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-ink-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-mono font-medium text-brand-500 mb-2">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
            Trusted by thousands
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-ink-200/60 bg-white p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" stroke="none" />
                ))}
              </div>

              <p className="text-sm text-ink-600 leading-relaxed flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-ink-100">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{t.name}</div>
                  <div className="text-xs text-ink-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
