'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExpertProfile, AvailabilityScheduleSlot } from '@/lib/api';
import { setAvailability, getSchedules } from '@/lib/api';
import type { TabProps } from './types';
import { DAYS } from './types';

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

  if (loading) return <p className="text-sm text-ink-400">{d.loading}</p>;

  return (
    <div className="rounded-2xl border-2 border-ink-900 bg-white p-6 shadow-retro">
      <h2 className="text-lg font-display font-bold text-ink-900 mb-6">{d.weeklySchedule}</h2>

      <div className="space-y-6">
        {DAYS.map((day) => {
          const daySlots = slots
            .map((s, i) => ({ ...s, _index: i }))
            .filter((s) => s.dayOfWeek === day);

          return (
            <div key={day} className="border-b border-ink-100 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-ink-700">{dayLabels[day]}</span>
                <button
                  type="button"
                  onClick={() => addSlot(day)}
                  className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  <Plus size={14} />
                  {d.addSlot}
                </button>
              </div>

              {daySlots.length === 0 ? (
                <p className="text-xs text-ink-300 ml-1">--</p>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div key={slot._index} className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-ink-400">{d.startTime}</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(slot._index, 'startTime', e.target.value)}
                          className="h-9 px-2 rounded-md border border-ink-200 text-sm text-ink-900 focus:outline-none focus:border-ink-400"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-ink-400">{d.endTime}</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(slot._index, 'endTime', e.target.value)}
                          className="h-9 px-2 rounded-md border border-ink-200 text-sm text-ink-900 focus:outline-none focus:border-ink-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSlot(slot._index)}
                        className="text-red-400 hover:text-red-600 ml-auto"
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

      {message && (
        <p className={`text-sm font-medium mt-4 ${isError ? 'text-red-600' : 'text-emerald-600'}`}>
          {message}
        </p>
      )}

      <div className="mt-6">
        <Button variant="brand" onClick={handleSave} disabled={saving}>
          {saving ? d.saving : d.saveSchedule}
        </Button>
      </div>
    </div>
  );
}
