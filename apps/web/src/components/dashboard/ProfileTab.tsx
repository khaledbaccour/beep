'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
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

  if (loading) return <p className="text-sm text-ink-400">{d.loading}</p>;

  return (
    <div className="rounded-2xl border-2 border-ink-900 bg-white p-6 shadow-retro">
      <h2 className="text-lg font-display font-bold text-ink-900 mb-6">
        {isNew ? d.createProfile : d.editProfile}
      </h2>

      {profile && (
        <div className="mb-6 p-4 rounded-xl bg-cream-50 border border-ink-200/60">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-1">{d.publicLink}</p>
          <a
            href={localePath(lang, `/${profile.slug}`)}
            className="text-sm font-bold text-ink-900 hover:text-brand-500 flex items-center gap-1.5"
          >
            {d.slugHelp}{profile.slug}
            <ExternalLink size={12} />
          </a>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">{d.slug}</label>
          <div className="flex items-center gap-0">
            <span className="h-11 px-3 flex items-center text-sm text-ink-400 bg-ink-50 border border-r-0 border-ink-200 rounded-l-lg">
              {d.slugHelp}
            </span>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
              className="rounded-l-none"
              required
              disabled={!isNew}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">{d.headline}</label>
          <Input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder={d.headlinePlaceholder}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">{d.bio}</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={d.bioPlaceholder}
            required
            minLength={10}
            rows={4}
            className="flex w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">{d.category}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="flex h-11 w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 transition-colors focus-visible:outline-none focus-visible:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-100"
          >
            <option value="">{d.selectCategory}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">{d.tags}</label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={d.tagsPlaceholder}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{d.sessionPrice}</label>
            <Input
              type="number"
              min="1"
              step="0.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">{d.sessionDuration}</label>
            <Input
              type="number"
              min="15"
              step="15"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">{d.timezone}</label>
          <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
        </div>

        {message && (
          <p className={`text-sm font-medium ${isError ? 'text-red-600' : 'text-emerald-600'}`}>
            {message}
          </p>
        )}
        <Button type="submit" variant="brand" disabled={saving}>
          {saving ? d.saving : d.saveProfile}
        </Button>
      </form>
    </div>
  );
}
