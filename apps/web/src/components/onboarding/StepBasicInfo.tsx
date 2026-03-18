'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { checkSlugAvailability } from '@/lib/api';
import type { Dictionary } from '@/i18n/types';

const CATEGORIES = [
  'FITNESS', 'EDUCATION', 'LAW', 'BUSINESS', 'TECHNOLOGY',
  'NUTRITION', 'FINANCE', 'LANGUAGES', 'MUSIC', 'ART', 'OTHER',
] as const;

interface StepBasicInfoData {
  slug: string;
  bio: string;
  headline: string;
  category: string;
}

interface StepBasicInfoProps {
  data: StepBasicInfoData;
  onChange: (data: StepBasicInfoData) => void;
  errors: Record<string, string>;
  dict: Dictionary;
}

export function StepBasicInfo({ data, onChange, errors, dict }: StepBasicInfoProps) {
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = useCallback(async (slug: string) => {
    if (slug.length < 3) {
      setSlugStatus('idle');
      return;
    }
    setSlugStatus('checking');
    try {
      const res = await checkSlugAvailability(slug);
      setSlugStatus(res.data.available ? 'available' : 'taken');
    } catch {
      setSlugStatus('idle');
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (data.slug.length >= 3) {
      debounceRef.current = setTimeout(() => checkSlug(data.slug), 300);
    } else {
      setSlugStatus('idle');
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data.slug, checkSlug]);

  function handleSlugChange(value: string) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange({ ...data, slug: cleaned });
  }

  return (
    <div className="space-y-5">
      {/* Slug */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.yourLink}
        </label>
        <div className="flex items-center gap-0">
          <span className="h-11 px-3.5 flex items-center text-sm font-bold text-ink-400 bg-cream-100 border-2 border-r-0 border-ink-200 rounded-l-xl whitespace-nowrap">
            beep.tn/
          </span>
          <div className="relative flex-1">
            <Input
              value={data.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="rounded-l-none rounded-r-xl border-2 border-ink-200 font-mono pr-10"
              placeholder="your-name"
              maxLength={30}
              required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {slugStatus === 'checking' && (
                <Loader2 size={16} className="animate-spin text-ink-400" />
              )}
              {slugStatus === 'available' && (
                <Check size={16} className="text-success-600" strokeWidth={3} />
              )}
              {slugStatus === 'taken' && (
                <X size={16} className="text-red-500" strokeWidth={3} />
              )}
            </div>
          </div>
        </div>
        {slugStatus === 'available' && (
          <p className="mt-1.5 text-xs font-medium text-success-600">{dict.onboarding.linkAvailable}</p>
        )}
        {slugStatus === 'taken' && (
          <p className="mt-1.5 text-xs font-medium text-red-500">{dict.onboarding.linkTaken}</p>
        )}
        {data.slug.length > 0 && data.slug.length < 3 && (
          <p className="mt-1.5 text-xs font-medium text-ink-400">{dict.onboarding.linkMinChars}</p>
        )}
        {errors.slug && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.slug}</p>}
      </div>

      {/* Headline */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.headlineLabel}
        </label>
        <Input
          value={data.headline}
          onChange={(e) => onChange({ ...data, headline: e.target.value })}
          placeholder={dict.onboarding.headlinePlaceholder}
          className="border-2 border-ink-200 rounded-xl"
        />
        <p className="mt-1 text-xs text-ink-400">{dict.onboarding.headlineHelp}</p>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.bio}
        </label>
        <textarea
          value={data.bio}
          onChange={(e) => onChange({ ...data, bio: e.target.value })}
          placeholder={dict.onboarding.bioPlaceholder}
          required
          minLength={10}
          rows={4}
          className="flex w-full rounded-xl border-2 border-ink-200 bg-white px-3.5 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100 resize-none"
        />
        <div className="flex justify-between mt-1">
          {errors.bio ? (
            <p className="text-xs font-medium text-red-500">{errors.bio}</p>
          ) : (
            <p className="text-xs text-ink-400">{dict.onboarding.bioMinChars}</p>
          )}
          <span className={`text-xs font-mono ${data.bio.length < 10 ? 'text-ink-400' : 'text-success-600'}`}>
            {data.bio.length}
          </span>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.category}
        </label>
        <select
          value={data.category}
          onChange={(e) => onChange({ ...data, category: e.target.value })}
          required
          className="flex h-11 w-full rounded-xl border-2 border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 font-medium transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100"
        >
          <option value="">{dict.onboarding.selectCategory}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.category}</p>}
      </div>
    </div>
  );
}

export type { StepBasicInfoData };
