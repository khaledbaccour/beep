'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { localePath } from '@/lib/i18n-utils';
import {
  type ExpertProfile,
  type CreateExpertProfileBody,
  createExpertProfile,
  updateExpertProfile,
} from '@/lib/api';
import type { TabProps } from './types';
import { CATEGORIES } from './types';

export function ProfileTab({ d, lang }: TabProps) {
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('30');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    const storedProfile = localStorage.getItem('beep_expert_profile');
    if (storedProfile) {
      const p: ExpertProfile = JSON.parse(storedProfile);
      populateForm(p);
      setProfile(p);
    } else {
      setIsNew(true);
    }
    setLoading(false);
  }, []);

  function populateForm(p: ExpertProfile) {
    setSlug(p.slug);
    setBio(p.bio);
    setHeadline(p.headline ?? '');
    setCategory(p.category);
    setTags(p.tags?.join(', ') ?? '');
    setPrice(String(p.sessionPriceMillimes / 1000));
    setDuration(String(p.sessionDurationMinutes));
    setTimezone(p.timezone);
    setIsNew(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);

    const body: CreateExpertProfileBody = {
      slug: slug.toLowerCase().trim(),
      bio,
      headline: headline || undefined,
      category,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      sessionPriceMillimes: Math.round(parseFloat(price) * 1000),
      sessionDurationMinutes: parseInt(duration, 10),
      timezone,
    };

    try {
      const res = isNew
        ? await createExpertProfile(body)
        : await updateExpertProfile(body);
      setProfile(res.data);
      localStorage.setItem('beep_expert_profile', JSON.stringify(res.data));
      populateForm(res.data);
      setMessage(d.profileSaved);
    } catch (err) {
      setIsError(true);
      setMessage(d.profileError + (err instanceof Error ? ': ' + err.message : ''));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 justify-center">
        <div className="w-5 h-5 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
        <p className="text-sm text-ink-400">{d.loading}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-[2.5px] border-ink-900 bg-white shadow-retro overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b-2 border-ink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center">
            <UserCircle size={14} className="text-white" />
          </div>
          <h2 className="text-lg font-display font-bold text-ink-900">
            {isNew ? d.createProfile : d.editProfile}
          </h2>
        </div>

        {profile && (
          <a
            href={localePath(lang, `/${profile.slug}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-ink-600 bg-cream-100 border-2 border-ink-200 rounded-lg hover:border-ink-400 transition-all"
          >
            <span className="font-mono">{d.slugHelp}{profile.slug}</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-5">
        {/* Slug */}
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{d.slug}</label>
          <div className="flex items-center gap-0">
            <span className="h-11 px-3.5 flex items-center text-sm font-bold text-ink-400 bg-cream-100 border-2 border-r-0 border-ink-200 rounded-l-xl">
              {d.slugHelp}
            </span>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
              className="rounded-l-none rounded-r-xl border-2 border-ink-200 font-mono"
              required
              disabled={!isNew}
            />
          </div>
        </div>

        {/* Headline */}
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{d.headline}</label>
          <Input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder={d.headlinePlaceholder}
            className="border-2 border-ink-200 rounded-xl"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{d.bio}</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={d.bioPlaceholder}
            required
            minLength={10}
            rows={4}
            className="flex w-full rounded-xl border-2 border-ink-200 bg-white px-3.5 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100 resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{d.category}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="flex h-11 w-full rounded-xl border-2 border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 font-medium transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100"
          >
            <option value="">{d.selectCategory}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{d.tags}</label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={d.tagsPlaceholder}
            className="border-2 border-ink-200 rounded-xl"
          />
        </div>

        {/* Price + Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{d.sessionPrice}</label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="border-2 border-ink-200 rounded-xl pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-400">TND</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{d.sessionDuration}</label>
            <div className="relative">
              <Input
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border-2 border-ink-200 rounded-xl pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-400">min</span>
            </div>
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">{d.timezone}</label>
          <Input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="border-2 border-ink-200 rounded-xl font-mono text-xs"
          />
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-xl text-sm font-medium ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-success-50 text-success-700 border border-success-100'}`}>
            {message}
          </div>
        )}

        <Button type="submit" variant="brand" disabled={saving} className="w-full sm:w-auto">
          {saving ? d.saving : d.saveProfile}
        </Button>
      </form>
    </div>
  );
}
