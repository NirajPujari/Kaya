import { format, parseISO, isToday, differenceInDays } from "date-fns";

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") classes.push(input);
    else if (Array.isArray(input)) classes.push(cn(...input));
  }
  return classes.join(" ");
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Today";
  return format(d, "EEE, MMM d");
}

export function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function addDays(dateStr: string, days: number): string {
  const d = parseISO(dateStr);
  d.setDate(d.getDate() + days);
  return format(d, "yyyy-MM-dd");
}

export function daysBetween(from: string, to: string): number {
  return differenceInDays(parseISO(to), parseISO(from));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatVolume(volume: number): string {
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k`;
  return `${volume}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getStreakCount(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  let streak = 0;
  let current = getTodayString();
  for (const d of sorted) {
    if (d === current) {
      streak++;
      const prev = parseISO(current);
      prev.setDate(prev.getDate() - 1);
      current = format(prev, "yyyy-MM-dd");
    } else {
      break;
    }
  }
  return streak;
}
