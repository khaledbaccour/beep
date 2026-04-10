export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

const LOCALE_MAP: Record<string, string> = { fr: 'fr-FR', en: 'en-US' };

export function formatDate(date: Date, lang: string): string {
  return date.toLocaleDateString(LOCALE_MAP[lang] || 'fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getLocaleString(lang: string): string {
  return LOCALE_MAP[lang] || 'fr-FR';
}

export function getDaysArray(startDate: Date, count: number): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString();
}
