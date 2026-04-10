'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SKILLS_BY_CATEGORY, ALL_SKILLS, ExpertCategory } from '@beep/shared';
import type { Dictionary } from '@/i18n/types';

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
  category?: string;
  dict: Dictionary;
}

export function StepExpertise({ data, onChange, errors, category, dict }: StepExpertiseProps) {
  const COMMON_LANGUAGES = [
    { value: 'French', label: dict.onboarding.langFrench },
    { value: 'English', label: dict.onboarding.langEnglish },
    { value: 'Spanish', label: dict.onboarding.langSpanish },
    { value: 'Italian', label: dict.onboarding.langItalian },
    { value: 'German', label: dict.onboarding.langGerman },
    { value: 'Portuguese', label: dict.onboarding.langPortuguese },
  ];

  const [tagInput, setTagInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelectingRef = useRef(false);

  // Get suggested skills based on category + search input
  const suggestedSkills = useMemo(() => {
    const query = tagInput.trim().toLowerCase();
    const alreadySelected = new Set(data.tags);

    // If user is typing, search across all skills
    if (query.length > 0) {
      const results = ALL_SKILLS
        .filter((s) => s.includes(query) && !alreadySelected.has(s))
        .slice(0, 12);
      return results;
    }

    // Otherwise show category-specific skills
    if (category && category in SKILLS_BY_CATEGORY) {
      return (SKILLS_BY_CATEGORY[category as ExpertCategory] || [])
        .filter((s) => !alreadySelected.has(s))
        .slice(0, 15);
    }

    return [];
  }, [tagInput, data.tags, category]);

  // Check if user's typed input is a custom skill (not in suggestions)
  const isCustomSkill = useMemo(() => {
    const query = tagInput.trim().toLowerCase();
    if (!query) return false;
    return !ALL_SKILLS.includes(query);
  }, [tagInput]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      if (tagInput.trim()) {
        addTag(tagInput);
        setTagInput('');
      }
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }

  function selectSuggestion(skill: string) {
    addTag(skill);
    setTagInput('');
    setShowSuggestions(true); // Keep open for multi-select
    inputRef.current?.focus();
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
      {/* Tags / Skills */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.skillTags}
        </label>

        {/* Selected tags */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
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
        )}

        {/* Search input with suggestions dropdown */}
        <div className="relative">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <Input
              ref={inputRef}
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => {
                setTimeout(() => {
                  if (isSelectingRef.current) {
                    isSelectingRef.current = false;
                    return;
                  }
                  if (tagInput.trim()) {
                    addTag(tagInput);
                    setTagInput('');
                  }
                }, 200);
              }}
              placeholder={dict.onboarding.searchSkills}
              className="border-2 border-ink-200 rounded-xl pl-9"
            />
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (suggestedSkills.length > 0 || isCustomSkill) && (
            <div
              ref={suggestionsRef}
              className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border-2 border-ink-200 rounded-xl shadow-elevated max-h-56 overflow-y-auto"
            >
              {suggestedSkills.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                    {tagInput.trim() ? dict.onboarding.matchingSkills : dict.onboarding.suggestedSkills}
                  </p>
                  <div className="flex flex-wrap gap-1.5 px-1 py-1">
                    {suggestedSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); isSelectingRef.current = true; }}
                        onClick={() => selectSuggestion(skill)}
                        className="px-3 py-1.5 text-xs font-bold text-ink-700 bg-cream-100 border border-ink-200 rounded-lg hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 transition-all duration-150"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isCustomSkill && tagInput.trim() && (
                <div className="border-t border-ink-100 p-2">
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); isSelectingRef.current = true; }}
                    onClick={() => {
                      addTag(tagInput);
                      setTagInput('');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition-all duration-150"
                  >
                    <Plus size={12} strokeWidth={3} />
                    {dict.onboarding.addCustomSkill} &ldquo;{tagInput.trim().toLowerCase()}&rdquo;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-1.5 text-xs text-ink-400">
          {dict.onboarding.skillsHelp}
        </p>
        {errors.tags && <p className="mt-1 text-xs font-medium text-red-500">{errors.tags}</p>}
      </div>

      {/* Years of Experience */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.yearsOfExperience}
        </label>
        <Input
          type="number"
          min="0"
          max="50"
          value={data.yearsOfExperience || ''}
          onChange={(e) => onChange({ ...data, yearsOfExperience: parseInt(e.target.value, 10) || 0 })}
          placeholder={dict.onboarding.yearsPlaceholder}
          className="border-2 border-ink-200 rounded-xl w-32"
        />
        {errors.yearsOfExperience && <p className="mt-1 text-xs font-medium text-red-500">{errors.yearsOfExperience}</p>}
      </div>

      {/* Languages */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.languagesSpoken}
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
          {COMMON_LANGUAGES.filter((l) => !data.languages.includes(l.value)).map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => addLanguage(lang.value)}
              className="px-2.5 py-1 text-xs font-medium text-ink-500 bg-cream-100 border border-ink-200 rounded-lg hover:border-ink-400 hover:text-ink-700 transition-all"
            >
              + {lang.label}
            </button>
          ))}
        </div>
        <Input
          value={langInput}
          onChange={(e) => setLangInput(e.target.value)}
          onKeyDown={handleLangKeyDown}
          onBlur={() => { if (langInput.trim()) { addLanguage(langInput); setLangInput(''); } }}
          placeholder={dict.onboarding.typeLanguage}
          className="border-2 border-ink-200 rounded-xl"
        />
        {errors.languages && <p className="mt-1 text-xs font-medium text-red-500">{errors.languages}</p>}
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          {dict.onboarding.certifications}
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
                  placeholder={dict.onboarding.certName}
                  className="border-2 border-ink-200 rounded-xl text-sm"
                />
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  placeholder={dict.onboarding.certIssuer}
                  className="border-2 border-ink-200 rounded-xl text-sm"
                />
                <Input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={cert.year || ''}
                  onChange={(e) => { const val = parseInt(e.target.value, 10); if (!isNaN(val)) updateCertification(index, 'year', val); }}
                  placeholder={dict.onboarding.certYear}
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
          <Plus size={14} /> {dict.onboarding.addCertification}
        </Button>
        <p className="mt-1 text-xs text-ink-400">{dict.onboarding.certificationsHelp}</p>
      </div>
    </div>
  );
}

export type { StepExpertiseData };
