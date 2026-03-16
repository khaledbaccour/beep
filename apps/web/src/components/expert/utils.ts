export function formatPrice(millimes: number): string {
  return (millimes / 1000).toFixed(millimes % 1000 === 0 ? 0 : 1);
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

const LOCALE_MAP: Record<string, string> = { fr: 'fr-TN', en: 'en-US', ar: 'ar-TN' };

export function formatDate(date: Date, lang: string): string {
  return date.toLocaleDateString(LOCALE_MAP[lang] || 'fr-TN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getLocaleString(lang: string): string {
  return LOCALE_MAP[lang] || 'fr-TN';
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
  return date.toISOString().split('T')[0];
}

export function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString();
}
