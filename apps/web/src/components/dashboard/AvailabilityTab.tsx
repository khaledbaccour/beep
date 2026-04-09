'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Clock, Copy, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExpertProfile, WeekSlot, AvailabilityScheduleSlot, RecurrenceConfig } from '@/lib/api';
import { setWeekAvailability, getWeekSlots, setAvailability, getSchedules, setRecurrence, getRecurrence } from '@/lib/api';
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

/** Get Monday of the week containing the given date */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6);
  const monthStart = monday.toLocaleDateString('fr-FR', { month: 'long', timeZone: 'UTC' });
  const year = monday.getUTCFullYear();
  const dayStart = monday.getUTCDate();
  const dayEnd = sunday.getUTCDate();

  if (monday.getUTCMonth() === sunday.getUTCMonth()) {
    return `${dayStart} - ${dayEnd} ${monthStart} ${year}`;
  }
  const monthEnd = sunday.toLocaleDateString('fr-FR', { month: 'long', timeZone: 'UTC' });
  return `${dayStart} ${monthStart} - ${dayEnd} ${monthEnd} ${year}`;
}

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Convert week slots (date-based) into a WeekSchedule keyed by day name */
function weekSlotsToSchedule(slots: WeekSlot[], monday: Date): WeekSchedule {
  const schedule: WeekSchedule = {};
  for (let i = 0; i < DAYS.length; i++) {
    schedule[DAYS[i]] = { enabled: false, blocks: [] };
  }
  for (const slot of slots) {
    // Find which day of week this date corresponds to
    const slotDate = new Date(slot.date + 'T00:00:00Z');
    const dayIndex = (slotDate.getUTCDay() + 6) % 7; // 0=Mon, 6=Sun
    const dayKey = DAYS[dayIndex];
    if (schedule[dayKey]) {
      schedule[dayKey].enabled = true;
      schedule[dayKey].blocks.push({
        startTime: normalizeTime(slot.startTime),
        endTime: normalizeTime(slot.endTime),
      });
    }
  }
  return schedule;
}

/** Convert recurring template slots to a WeekSchedule */
function templateToSchedule(slots: AvailabilityScheduleSlot[]): WeekSchedule {
  const schedule: WeekSchedule = {};
  for (const day of DAYS) {
    schedule[day] = { enabled: false, blocks: [] };
  }
  for (const slot of slots) {
    if (schedule[slot.dayOfWeek]) {
      schedule[slot.dayOfWeek].enabled = true;
      schedule[slot.dayOfWeek].blocks.push({
        startTime: normalizeTime(slot.startTime),
        endTime: normalizeTime(slot.endTime),
      });
    }
  }
  return schedule;
}

/** Convert WeekSchedule to WeekSlot[] for a specific week */
function scheduleToWeekSlots(schedule: WeekSchedule, monday: Date): WeekSlot[] {
  const slots: WeekSlot[] = [];
  for (let i = 0; i < DAYS.length; i++) {
    const ds = schedule[DAYS[i]];
    if (ds.enabled) {
      const date = toDateStr(addDays(monday, i));
      for (const block of ds.blocks) {
        slots.push({ date, startTime: block.startTime, endTime: block.endTime });
      }
    }
  }
  return slots;
}

/** Convert WeekSchedule to AvailabilityScheduleSlot[] (template format) */
function scheduleToTemplateSlots(schedule: WeekSchedule): AvailabilityScheduleSlot[] {
  const slots: AvailabilityScheduleSlot[] = [];
  for (const day of DAYS) {
    const ds = schedule[day];
    if (ds.enabled) {
      for (const block of ds.blocks) {
        slots.push({ dayOfWeek: day, startTime: block.startTime, endTime: block.endTime, isActive: true });
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

  const [monday, setMonday] = useState(() => getMonday(new Date()));
  const [schedule, setSchedule] = useState<WeekSchedule>(() => {
    const init: WeekSchedule = {};
    for (const day of DAYS) init[day] = { enabled: false, blocks: [] };
    return init;
  });
  const [template, setTemplate] = useState<WeekSchedule>(() => {
    const init: WeekSchedule = {};
    for (const day of DAYS) init[day] = { enabled: false, blocks: [] };
    return init;
  });
  const [recurrence, setRecurrenceState] = useState<RecurrenceConfig>({ isRecurring: false, recurringUntil: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [profileId, setProfileId] = useState<string>('');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [isFromTemplate, setIsFromTemplate] = useState(false);

  const loadWeek = useCallback(async (mon: Date, expId: string, tpl: WeekSchedule, rec: RecurrenceConfig) => {
    try {
      const res = await getWeekSlots(expId, toDateStr(mon));
      const weekData = res.data ?? [];
      if (weekData.length > 0) {
        setSchedule(weekSlotsToSchedule(weekData, mon));
        setIsFromTemplate(false);
      } else if (rec.isRecurring) {
        // Pre-fill from template
        const hasAnyTemplate = DAYS.some((day) => tpl[day].enabled);
        if (hasAnyTemplate) {
          setSchedule(JSON.parse(JSON.stringify(tpl)));
          setIsFromTemplate(true);
        } else {
          const init: WeekSchedule = {};
          for (const day of DAYS) init[day] = { enabled: false, blocks: [] };
          setSchedule(init);
          setIsFromTemplate(false);
        }
      } else {
        const init: WeekSchedule = {};
        for (const day of DAYS) init[day] = { enabled: false, blocks: [] };
        setSchedule(init);
        setIsFromTemplate(false);
      }
    } catch {
      // Silently fail, leave empty
    }
  }, []);

  useEffect(() => {
    const storedProfile = localStorage.getItem('beep_expert_profile');
    if (!storedProfile) {
      setLoading(false);
      return;
    }

    const p: ExpertProfile = JSON.parse(storedProfile);
    setProfileId(p.id);

    Promise.all([
      getSchedules(p.id),
      getRecurrence(p.id),
      getWeekSlots(p.id, toDateStr(monday)),
    ]).then(([schedRes, recRes, weekRes]) => {
      const tpl = templateToSchedule(schedRes.data ?? []);
      setTemplate(tpl);

      const rec = recRes.data ?? { isRecurring: false, recurringUntil: null };
      setRecurrenceState(rec);

      const weekData = weekRes.data ?? [];
      if (weekData.length > 0) {
        setSchedule(weekSlotsToSchedule(weekData, monday));
        setIsFromTemplate(false);
      } else if (rec.isRecurring) {
        const hasAnyTemplate = DAYS.some((day) => tpl[day].enabled);
        if (hasAnyTemplate) {
          setSchedule(JSON.parse(JSON.stringify(tpl)));
          setIsFromTemplate(true);
        }
      }
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function navigateWeek(direction: -1 | 1) {
    const newMonday = addDays(monday, direction * 7);
    setMonday(newMonday);
    setMessage('');
    setIsError(false);
    await loadWeek(newMonday, profileId, template, recurrence);
  }

  function toggleDay(day: string) {
    setIsFromTemplate(false);
    setSchedule((prev) => {
      const ds = prev[day];
      return {
        ...prev,
        [day]: {
          enabled: !ds.enabled,
          blocks: !ds.enabled ? (ds.blocks.length > 0 ? ds.blocks : [{ ...DEFAULT_BLOCK }]) : ds.blocks,
        },
      };
    });
  }

  function updateBlock(day: string, blockIndex: number, field: 'startTime' | 'endTime', value: string) {
    setIsFromTemplate(false);
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        blocks: prev[day].blocks.map((b, i) => (i === blockIndex ? { ...b, [field]: value } : b)),
      },
    }));
  }

  function addBlock(day: string) {
    setIsFromTemplate(false);
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], blocks: [...prev[day].blocks, { ...DEFAULT_BLOCK }] },
    }));
  }

  function removeBlock(day: string, blockIndex: number) {
    setIsFromTemplate(false);
    setSchedule((prev) => {
      const newBlocks = prev[day].blocks.filter((_, i) => i !== blockIndex);
      return {
        ...prev,
        [day]: { ...prev[day], enabled: newBlocks.length > 0, blocks: newBlocks },
      };
    });
  }

  function copyToAll(sourceDay: string) {
    setIsFromTemplate(false);
    setSchedule((prev) => {
      const source = prev[sourceDay];
      const updated: WeekSchedule = { ...prev };
      for (const day of DAYS) {
        if (day !== sourceDay) {
          updated[day] = { enabled: source.enabled, blocks: source.blocks.map((b) => ({ ...b })) };
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
      const slots = scheduleToWeekSlots(schedule, monday);
      await setWeekAvailability(toDateStr(monday), slots);
      setIsFromTemplate(false);
      setMessage(d.scheduleSaved);
    } catch {
      setIsError(true);
      setMessage(d.scheduleError);
    } finally {
      setSaving(false);
    }
  }

  async function handleRecurrenceToggle() {
    const newVal = !recurrence.isRecurring;
    const newRec: RecurrenceConfig = { isRecurring: newVal, recurringUntil: recurrence.recurringUntil };
    setRecurrenceState(newRec);
    try {
      await setRecurrence(newRec);
    } catch {
      setRecurrenceState(recurrence); // revert
    }
  }

  async function handleRecurrenceUntilChange(value: string) {
    const newRec: RecurrenceConfig = {
      isRecurring: recurrence.isRecurring,
      recurringUntil: value || null,
    };
    setRecurrenceState(newRec);
    try {
      await setRecurrence(newRec);
    } catch {
      setRecurrenceState(recurrence);
    }
  }

  async function handleSaveTemplate() {
    setSaving(true);
    try {
      const slots = scheduleToTemplateSlots(template);
      await setAvailability(slots);
      setMessage(d.scheduleSaved);
      setShowTemplateEditor(false);
    } catch {
      setIsError(true);
      setMessage(d.scheduleError);
    } finally {
      setSaving(false);
    }
  }

  // Template editor handlers
  function toggleTemplateDay(day: string) {
    setTemplate((prev) => {
      const ds = prev[day];
      return {
        ...prev,
        [day]: {
          enabled: !ds.enabled,
          blocks: !ds.enabled ? (ds.blocks.length > 0 ? ds.blocks : [{ ...DEFAULT_BLOCK }]) : ds.blocks,
        },
      };
    });
  }

  function updateTemplateBlock(day: string, bi: number, field: 'startTime' | 'endTime', value: string) {
    setTemplate((prev) => ({
      ...prev,
      [day]: { ...prev[day], blocks: prev[day].blocks.map((b, i) => (i === bi ? { ...b, [field]: value } : b)) },
    }));
  }

  function addTemplateBlock(day: string) {
    setTemplate((prev) => ({
      ...prev,
      [day]: { ...prev[day], blocks: [...prev[day].blocks, { ...DEFAULT_BLOCK }] },
    }));
  }

  function removeTemplateBlock(day: string, bi: number) {
    setTemplate((prev) => {
      const nb = prev[day].blocks.filter((_, i) => i !== bi);
      return { ...prev, [day]: { ...prev[day], enabled: nb.length > 0, blocks: nb } };
    });
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 justify-center">
        <div className="w-5 h-5 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
        <p className="text-sm text-ink-400">{d.loading}</p>
      </div>
    );
  }

  const isThisWeek = toDateStr(getMonday(new Date())) === toDateStr(monday);

  return (
    <div className="space-y-4">
      {/* Week Schedule Card */}
      <div className="rounded-2xl border-[2.5px] border-ink-900 bg-white shadow-retro overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b-[2.5px] border-ink-900 bg-cream-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center shadow-retro-sm">
              <Clock size={14} className="text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-ink-900">{d.weeklySchedule}</h2>
          </div>
          <Button variant="brand" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 shadow-retro-sm border-2 border-ink-900 text-xs sm:text-sm whitespace-nowrap">
            {saving ? d.saving : d.saveSchedule}
          </Button>
        </div>

        {/* Week Navigator */}
        <div className="px-4 sm:px-6 py-3 border-b-2 border-ink-100 bg-cream-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateWeek(-1)}
            className="p-2 rounded-lg border-2 border-ink-200 hover:border-ink-400 bg-white transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-ink-900 capitalize">{formatWeekRange(monday)}</p>
            {isThisWeek && (
              <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                {d.weekOf || 'This week'}
              </span>
            )}
            {isFromTemplate && (
              <span className="text-[10px] font-bold text-ink-400 bg-ink-50 px-2 py-0.5 rounded-full border border-ink-200 ml-1">
                {d.editTemplate || 'From template'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigateWeek(1)}
            className="p-2 rounded-lg border-2 border-ink-200 hover:border-ink-400 bg-white transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Days */}
        <div className="divide-y-2 divide-ink-100">
          {DAYS.map((day, dayIndex) => {
            const ds = schedule[day];
            const dateOfDay = addDays(monday, dayIndex);
            const dateNum = dateOfDay.getUTCDate();

            return (
              <div key={day} className={`px-4 sm:px-6 py-3 sm:py-4 transition-colors ${ds.enabled ? 'bg-white' : 'bg-ink-50/40'}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`relative w-[52px] h-7 rounded-full border-[2.5px] border-ink-900 transition-colors flex-shrink-0 mt-0.5 ${
                      ds.enabled ? 'bg-brand-600' : 'bg-ink-100'
                    }`}
                    aria-label={`Toggle ${dayLabels[day]}`}
                  >
                    <span
                      className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white border-2 border-ink-900 transition-transform ${
                        ds.enabled ? 'translate-x-[24px]' : 'translate-x-[3px]'
                      }`}
                    />
                  </button>

                  {/* Day label + date */}
                  <div className={`min-w-[80px] sm:min-w-[110px] mt-1 ${ds.enabled ? 'text-ink-900' : 'text-ink-400'}`}>
                    <span className="text-sm font-bold">{dayLabels[day]}</span>
                    <span className="text-xs text-ink-400 ml-1">{dateNum}</span>
                  </div>

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
                              className="h-9 px-2 sm:px-3 rounded-lg border-2 border-ink-200 text-sm font-bold text-ink-900 focus:outline-none focus:border-brand-500 bg-white w-[110px] sm:w-[130px]"
                            />
                            <span className="text-ink-300 font-bold text-xs">-</span>
                            <input
                              type="time"
                              value={block.endTime}
                              onChange={(e) => updateBlock(day, bi, 'endTime', e.target.value)}
                              className="h-9 px-2 sm:px-3 rounded-lg border-2 border-ink-200 text-sm font-bold text-ink-900 focus:outline-none focus:border-brand-500 bg-white w-[110px] sm:w-[130px]"
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
                        className="flex items-center px-2 py-1.5 text-[11px] font-bold text-brand-600 bg-brand-50 rounded-lg border border-brand-200 hover:border-brand-400 hover:bg-brand-100 transition-all"
                        title={d.addTimeBlock}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToAll(day)}
                        className="flex items-center px-2 py-1.5 text-[11px] font-bold text-ink-500 bg-ink-50 rounded-lg border border-ink-200 hover:border-ink-400 hover:bg-ink-100 transition-all"
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

      {/* Recurring Schedule Card */}
      <div className="rounded-2xl border-[2.5px] border-ink-900 bg-white shadow-retro overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b-[2.5px] border-ink-900 bg-cream-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 border-2 border-ink-900 flex items-center justify-center shadow-retro-sm">
              <Repeat size={14} className="text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-ink-900">{d.recurringSchedule || 'Recurring schedule'}</h2>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 space-y-4">
          {/* Toggle recurring */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRecurrenceToggle}
              className={`relative w-[52px] h-7 rounded-full border-[2.5px] border-ink-900 transition-colors flex-shrink-0 ${
                recurrence.isRecurring ? 'bg-brand-600' : 'bg-ink-100'
              }`}
            >
              <span
                className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white border-2 border-ink-900 transition-transform ${
                  recurrence.isRecurring ? 'translate-x-[24px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
            <span className="text-sm font-bold text-ink-900">{d.applyRecurring || 'Apply weekly template'}</span>
          </div>

          {/* Recurring until */}
          {recurrence.isRecurring && (
            <div className="ml-[68px] space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-ink-500">{d.until || 'Until'}</label>
                <input
                  type="date"
                  value={recurrence.recurringUntil || ''}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleRecurrenceUntilChange(e.target.value)}
                  className="h-9 px-3 rounded-lg border-2 border-ink-200 text-sm font-bold text-ink-900 focus:outline-none focus:border-brand-500 bg-white"
                  placeholder={d.forever || 'Forever'}
                />
                {recurrence.recurringUntil && (
                  <button
                    type="button"
                    onClick={() => handleRecurrenceUntilChange('')}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    {d.forever || 'Forever'}
                  </button>
                )}
              </div>

              {/* Edit template button */}
              <button
                type="button"
                onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200 hover:border-brand-400 transition-all"
              >
                {d.editTemplate || 'Edit template'}
              </button>

              {/* Template editor (collapsed by default) */}
              {showTemplateEditor && (
                <div className="border-2 border-ink-200 rounded-xl p-4 bg-cream-50/50 space-y-2">
                  {DAYS.map((day) => {
                    const ds = template[day];
                    return (
                      <div key={day} className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleTemplateDay(day)}
                          className={`relative w-10 h-6 rounded-full border-2 border-ink-900 transition-colors flex-shrink-0 mt-0.5 ${
                            ds.enabled ? 'bg-brand-500' : 'bg-ink-100'
                          }`}
                        >
                          <span className={`absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white border-[1.5px] border-ink-900 transition-transform ${
                            ds.enabled ? 'translate-x-[16px]' : 'translate-x-[2px]'
                          }`} />
                        </button>
                        <span className={`text-xs font-bold min-w-[60px] mt-1 ${ds.enabled ? 'text-ink-900' : 'text-ink-300'}`}>
                          {dayLabels[day]}
                        </span>
                        <div className="flex-1">
                          {ds.enabled ? (
                            <div className="space-y-1">
                              {ds.blocks.map((b, bi) => (
                                <div key={bi} className="flex items-center gap-1.5">
                                  <input type="time" value={b.startTime} onChange={(e) => updateTemplateBlock(day, bi, 'startTime', e.target.value)}
                                    className="h-7 px-2 rounded border border-ink-200 text-xs font-bold text-ink-900 bg-white w-[100px]" />
                                  <span className="text-ink-300 text-[10px]">-</span>
                                  <input type="time" value={b.endTime} onChange={(e) => updateTemplateBlock(day, bi, 'endTime', e.target.value)}
                                    className="h-7 px-2 rounded border border-ink-200 text-xs font-bold text-ink-900 bg-white w-[100px]" />
                                  <button type="button" onClick={() => removeTemplateBlock(day, bi)} className="p-1 text-ink-300 hover:text-red-500">
                                    <Trash2 size={11} />
                                  </button>
                                  <button type="button" onClick={() => addTemplateBlock(day)} className="p-1 text-brand-500 hover:text-brand-700">
                                    <Plus size={11} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-ink-300 italic mt-1 block">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="brand" size="sm" onClick={handleSaveTemplate} disabled={saving} className="mt-3 text-xs border-2 border-ink-900 shadow-retro-sm">
                    {saving ? d.saving : d.saveSchedule}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
