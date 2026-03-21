'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Clock, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExpertProfile, AvailabilityScheduleSlot } from '@/lib/api';
import { setAvailability, getSchedules } from '@/lib/api';
import type { TabProps } from './types';
import { DAYS } from './types';

interface DaySchedule {
  enabled: boolean;
  blocks: { startTime: string; endTime: string }[];
}

type WeekSchedule = Record<string, DaySchedule>;

const DEFAULT_BLOCK = { startTime: '09:00', endTime: '17:00' };

function normalizeTime(t: string): string {
  return t.slice(0, 5);
}

function slotsToWeekSchedule(slots: AvailabilityScheduleSlot[]): WeekSchedule {
  const schedule: WeekSchedule = {};
  for (const day of DAYS) {
    schedule[day] = { enabled: false, blocks: [] };
  }
  for (const slot of slots) {
    const day = slot.dayOfWeek;
    if (schedule[day]) {
      schedule[day].enabled = true;
      schedule[day].blocks.push({
        startTime: normalizeTime(slot.startTime),
        endTime: normalizeTime(slot.endTime),
      });
    }
  }
  return schedule;
}

function weekScheduleToSlots(schedule: WeekSchedule): AvailabilityScheduleSlot[] {
  const slots: AvailabilityScheduleSlot[] = [];
  for (const day of DAYS) {
    const ds = schedule[day];
    if (ds.enabled) {
      for (const block of ds.blocks) {
        slots.push({
          dayOfWeek: day,
          startTime: block.startTime,
          endTime: block.endTime,
          isActive: true,
        });
      }
    }
  }
  return slots;
}

export function AvailabilityTab({ d }: TabProps) {
  const dayLabels: Record<string, string> = {
    MONDAY: d.monday, TUESDAY: d.tuesday, WEDNESDAY: d.wednesday,
    THURSDAY: d.thursday, FRIDAY: d.friday, SATURDAY: d.saturday, SUNDAY: d.sunday,
  };

  const [schedule, setSchedule] = useState<WeekSchedule>(() => {
    const init: WeekSchedule = {};
    for (const day of DAYS) {
      init[day] = { enabled: false, blocks: [] };
    }
    return init;
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const storedProfile = localStorage.getItem('beep_expert_profile');
    if (storedProfile) {
      const p: ExpertProfile = JSON.parse(storedProfile);
      getSchedules(p.id)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setSchedule(slotsToWeekSchedule(res.data));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function toggleDay(day: string) {
    setSchedule((prev) => {
      const ds = prev[day];
      return {
        ...prev,
        [day]: {
          enabled: !ds.enabled,
          blocks: !ds.enabled
            ? (ds.blocks.length > 0 ? ds.blocks : [{ ...DEFAULT_BLOCK }])
            : ds.blocks,
        },
      };
    });
  }

  function updateBlock(day: string, blockIndex: number, field: 'startTime' | 'endTime', value: string) {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        blocks: prev[day].blocks.map((b, i) => (i === blockIndex ? { ...b, [field]: value } : b)),
      },
    }));
  }

  function addBlock(day: string) {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        blocks: [...prev[day].blocks, { ...DEFAULT_BLOCK }],
      },
    }));
  }

  function removeBlock(day: string, blockIndex: number) {
    setSchedule((prev) => {
      const newBlocks = prev[day].blocks.filter((_, i) => i !== blockIndex);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          enabled: newBlocks.length > 0,
          blocks: newBlocks,
        },
      };
    });
  }

  function copyToAll(sourceDay: string) {
    setSchedule((prev) => {
      const source = prev[sourceDay];
      const updated: WeekSchedule = { ...prev };
      for (const day of DAYS) {
        if (day !== sourceDay) {
          updated[day] = {
            enabled: source.enabled,
            blocks: source.blocks.map((b) => ({ ...b })),
          };
        }
      }
      return updated;
    });
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    setIsError(false);
    try {
      const slots = weekScheduleToSlots(schedule);
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
      <div className="px-6 py-5 border-b-[2.5px] border-ink-900 bg-cream-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink-900 border-2 border-ink-900 flex items-center justify-center shadow-retro-sm">
            <Clock size={14} className="text-white" />
          </div>
          <h2 className="text-lg font-display font-bold text-ink-900">{d.weeklySchedule}</h2>
        </div>
        <Button variant="brand" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 shadow-retro-sm border-2 border-ink-900">
          {saving ? d.saving : d.saveSchedule}
        </Button>
      </div>

      {/* Days */}
      <div className="divide-y-2 divide-ink-100">
        {DAYS.map((day) => {
          const ds = schedule[day];
          return (
            <div key={day} className={`px-6 py-4 transition-colors ${ds.enabled ? 'bg-white' : 'bg-ink-50/40'}`}>
              {/* Day row */}
              <div className="flex items-start gap-4">
                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`relative w-12 h-7 rounded-full border-[2.5px] border-ink-900 transition-colors flex-shrink-0 mt-0.5 ${
                    ds.enabled ? 'bg-brand-600' : 'bg-ink-100'
                  }`}
                  aria-label={`Toggle ${dayLabels[day]}`}
                >
                  <span
                    className={`absolute top-[2px] w-4 h-4 rounded-full bg-white border-2 border-ink-900 transition-transform ${
                      ds.enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'
                    }`}
                  />
                </button>

                {/* Day label */}
                <span className={`text-sm font-bold min-w-[100px] mt-1 ${ds.enabled ? 'text-ink-900' : 'text-ink-400'}`}>
                  {dayLabels[day]}
                </span>

                {/* Time blocks or "Unavailable" */}
                <div className="flex-1 min-w-0">
                  {ds.enabled ? (
                    <div className="space-y-2">
                      {ds.blocks.map((block, bi) => (
                        <div key={bi} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <input
                            type="time"
                            value={block.startTime}
                            onChange={(e) => updateBlock(day, bi, 'startTime', e.target.value)}
                            className="h-9 px-3 rounded-lg border-2 border-ink-200 text-sm font-bold text-ink-900 focus:outline-none focus:border-brand-500 bg-white w-[130px]"
                          />
                          <span className="text-ink-300 font-bold text-xs">-</span>
                          <input
                            type="time"
                            value={block.endTime}
                            onChange={(e) => updateBlock(day, bi, 'endTime', e.target.value)}
                            className="h-9 px-3 rounded-lg border-2 border-ink-200 text-sm font-bold text-ink-900 focus:outline-none focus:border-brand-500 bg-white w-[130px]"
                          />
                          <button
                            type="button"
                            onClick={() => removeBlock(day, bi)}
                            className="p-1.5 rounded-lg text-ink-300 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                            aria-label={d.removeSlot}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-ink-300 italic mt-1 block">{d.unavailable}</span>
                  )}
                </div>

                {/* Actions */}
                {ds.enabled && (
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                    <button
                      type="button"
                      onClick={() => addBlock(day)}
                      className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold text-brand-600 bg-brand-50 rounded-lg border border-brand-200 hover:border-brand-400 hover:bg-brand-100 transition-all"
                      title={d.addTimeBlock}
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToAll(day)}
                      className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold text-ink-500 bg-ink-50 rounded-lg border border-ink-200 hover:border-ink-400 hover:bg-ink-100 transition-all"
                      title={d.copyToAll}
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message */}
      {message && (
        <div className={`px-6 py-3 text-sm font-bold border-t-2 ${
          isError
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-success-50 text-success-700 border-success-100'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
