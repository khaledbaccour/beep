'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExpertProfile, AvailabilityScheduleSlot } from '@/lib/api';
import { setAvailability, getSchedules } from '@/lib/api';
import type { TabProps } from './types';
import { DAYS } from './types';

const DAY_EMOJI: Record<string, string> = {
  MONDAY: '🟡',
  TUESDAY: '🟢',
  WEDNESDAY: '🔵',
  THURSDAY: '🟣',
  FRIDAY: '🟠',
  SATURDAY: '⚪',
  SUNDAY: '🔴',
};

export function AvailabilityTab({ d }: TabProps) {
  const dayLabels: Record<string, string> = {
    MONDAY: d.monday, TUESDAY: d.tuesday, WEDNESDAY: d.wednesday,
    THURSDAY: d.thursday, FRIDAY: d.friday, SATURDAY: d.saturday, SUNDAY: d.sunday,
  };

  const [slots, setSlots] = useState<AvailabilityScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const storedProfile = localStorage.getItem('beep_expert_profile');
    if (storedProfile) {
      const p: ExpertProfile = JSON.parse(storedProfile);
      getSchedules(p.id)
        .then((res) => setSlots(res.data ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function addSlot(day: string) {
    setSlots([...slots, { dayOfWeek: day, startTime: '09:00', endTime: '10:00', isActive: true }]);
  }

  function removeSlot(index: number) {
    setSlots(slots.filter((_, i) => i !== index));
  }

  function updateSlot(index: number, field: 'startTime' | 'endTime', value: string) {
    setSlots(slots.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    setIsError(false);
    try {
      await setAvailability(slots);
      setMessage(d.scheduleSaved);
    } catch {
      setIsError(true);
      setMessage(d.scheduleError);
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
      <div className="px-6 py-5 border-b-2 border-ink-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center">
            <Clock size={14} className="text-white" />
          </div>
          <h2 className="text-lg font-display font-bold text-ink-900">{d.weeklySchedule}</h2>
        </div>
        <Button variant="brand" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          {saving ? d.saving : d.saveSchedule}
        </Button>
      </div>

      {/* Days */}
      <div className="divide-y-2 divide-ink-100/60">
        {DAYS.map((day) => {
          const daySlots = slots
            .map((s, i) => ({ ...s, _index: i }))
            .filter((s) => s.dayOfWeek === day);

          return (
            <div key={day} className="px-6 py-4 hover:bg-cream-50/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{DAY_EMOJI[day]}</span>
                  <span className="text-sm font-bold text-ink-900">{dayLabels[day]}</span>
                  {daySlots.length > 0 && (
                    <span className="text-[10px] font-bold text-ink-400 bg-ink-50 px-2 py-0.5 rounded-full border border-ink-200">
                      {daySlots.length} {daySlots.length === 1 ? 'slot' : 'slots'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addSlot(day)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 rounded-lg border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-100 transition-all"
                >
                  <Plus size={12} />
                  {d.addSlot}
                </button>
              </div>

              {daySlots.length === 0 ? (
                <p className="text-xs text-ink-300 italic ml-6">—</p>
              ) : (
                <div className="space-y-2 ml-6">
                  {daySlots.map((slot) => (
                    <div key={slot._index} className="flex items-center gap-3 p-2.5 rounded-lg bg-cream-50 border border-ink-200/60">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">{d.startTime}</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(slot._index, 'startTime', e.target.value)}
                          className="h-8 px-2.5 rounded-lg border-2 border-ink-200 text-sm font-bold text-ink-900 focus:outline-none focus:border-ink-400 bg-white"
                        />
                      </div>
                      <span className="text-ink-300 font-bold">→</span>
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">{d.endTime}</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(slot._index, 'endTime', e.target.value)}
                          className="h-8 px-2.5 rounded-lg border-2 border-ink-200 text-sm font-bold text-ink-900 focus:outline-none focus:border-ink-400 bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSlot(slot._index)}
                        className="ml-auto p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message */}
      {message && (
        <div className={`px-6 py-3 text-sm font-medium ${isError ? 'bg-red-50 text-red-700' : 'bg-success-50 text-success-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
