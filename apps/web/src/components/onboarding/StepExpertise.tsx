'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Certification {
  name: string;
  issuer: string;
  year: number;
}

interface StepExpertiseData {
  tags: string[];
  certifications: Certification[];
  yearsOfExperience: number;
  languages: string[];
}

interface StepExpertiseProps {
  data: StepExpertiseData;
  onChange: (data: StepExpertiseData) => void;
  errors: Record<string, string>;
}

const COMMON_LANGUAGES = [
  'Arabic', 'French', 'English', 'Italian', 'German', 'Spanish', 'Turkish',
];

export function StepExpertise({ data, onChange, errors }: StepExpertiseProps) {
  const [tagInput, setTagInput] = useState('');
  const [langInput, setLangInput] = useState('');

  function addTag(value: string) {
    const tag = value.trim().toLowerCase();
    if (tag && !data.tags.includes(tag)) {
      onChange({ ...data, tags: [...data.tags, tag] });
    }
  }

  function removeTag(tag: string) {
    onChange({ ...data, tags: data.tags.filter((t) => t !== tag) });
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  }

  function addLanguage(lang: string) {
    const trimmed = lang.trim();
    if (trimmed && !data.languages.includes(trimmed)) {
      onChange({ ...data, languages: [...data.languages, trimmed] });
    }
  }

  function removeLanguage(lang: string) {
    onChange({ ...data, languages: data.languages.filter((l) => l !== lang) });
  }

  function handleLangKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addLanguage(langInput);
      setLangInput('');
    }
  }

  function addCertification() {
    onChange({
      ...data,
      certifications: [...data.certifications, { name: '', issuer: '', year: new Date().getFullYear() }],
    });
  }

  function updateCertification(index: number, field: keyof Certification, value: string | number) {
    const updated = [...data.certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, certifications: updated });
  }

  function removeCertification(index: number) {
    onChange({ ...data, certifications: data.certifications.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-6">
      {/* Tags */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          Skill Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-peach-100 text-ink-900 border-2 border-ink-200 rounded-lg"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={() => { if (tagInput.trim()) { addTag(tagInput); setTagInput(''); } }}
          placeholder="Type a skill and press Enter (e.g. yoga, weight loss, strength)"
          className="border-2 border-ink-200 rounded-xl"
        />
        <p className="mt-1 text-xs text-ink-400">Press Enter or comma to add a tag</p>
        {errors.tags && <p className="mt-1 text-xs font-medium text-red-500">{errors.tags}</p>}
      </div>

      {/* Years of Experience */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          Years of Experience *
        </label>
        <Input
          type="number"
          min="0"
          max="50"
          value={data.yearsOfExperience || ''}
          onChange={(e) => onChange({ ...data, yearsOfExperience: parseInt(e.target.value, 10) || 0 })}
          placeholder="e.g. 5"
          className="border-2 border-ink-200 rounded-xl w-32"
        />
        {errors.yearsOfExperience && <p className="mt-1 text-xs font-medium text-red-500">{errors.yearsOfExperience}</p>}
      </div>

      {/* Languages */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          Languages Spoken *
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-brand-100 text-ink-900 border-2 border-ink-200 rounded-lg"
            >
              {lang}
              <button type="button" onClick={() => removeLanguage(lang)} className="hover:text-red-500 transition-colors">
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {COMMON_LANGUAGES.filter((l) => !data.languages.includes(l)).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => addLanguage(lang)}
              className="px-2.5 py-1 text-xs font-medium text-ink-500 bg-cream-100 border border-ink-200 rounded-lg hover:border-ink-400 hover:text-ink-700 transition-all"
            >
              + {lang}
            </button>
          ))}
        </div>
        <Input
          value={langInput}
          onChange={(e) => setLangInput(e.target.value)}
          onKeyDown={handleLangKeyDown}
          onBlur={() => { if (langInput.trim()) { addLanguage(langInput); setLangInput(''); } }}
          placeholder="Or type a language and press Enter"
          className="border-2 border-ink-200 rounded-xl"
        />
        {errors.languages && <p className="mt-1 text-xs font-medium text-red-500">{errors.languages}</p>}
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          Certifications
        </label>
        <div className="space-y-3">
          {data.certifications.map((cert, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border-2 border-ink-200 bg-cream-50 space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors"
              >
                <X size={14} strokeWidth={3} />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  placeholder="Certification name"
                  className="border-2 border-ink-200 rounded-xl text-sm"
                />
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  placeholder="Issuing organization"
                  className="border-2 border-ink-200 rounded-xl text-sm"
                />
                <Input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={cert.year || ''}
                  onChange={(e) => { const val = parseInt(e.target.value, 10); if (!isNaN(val)) updateCertification(index, 'year', val); }}
                  placeholder="Year"
                  className="border-2 border-ink-200 rounded-xl text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCertification}
          className="mt-3 rounded-xl"
        >
          <Plus size={14} /> Add Certification
        </Button>
        <p className="mt-1 text-xs text-ink-400">Optional - add your professional certifications</p>
      </div>
    </div>
  );
}

export type { StepExpertiseData };
