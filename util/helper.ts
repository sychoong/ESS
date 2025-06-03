// Helper: parse YYYY-MM-DD string to Date (midnight)
function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Helper: format Date to YYYY-MM-DD
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Helper: get Sunday 0-based week start for a date
function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper: get Saturday 0-based week end for a date
function endOfWeek(date: Date): Date {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return d;
}

// Helper: start of month
function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Helper: end of month
function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// Add days helper
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Get ISO week number and year
function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Thursday in this week determines the year
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const diff =
    (d.getTime() -
      week1.getTime() +
      (week1.getDay() === 0 ? 86400000 * 6 : 86400000 * (week1.getDay() - 1))) /
    86400000;
  return {
    year: d.getFullYear(),
    week: 1 + Math.floor(diff / 7),
  };
}

// Format duration minutes -> "Xh Ym"
function formatDuration(minutes: number | undefined | null): string {
  if (!minutes) return "0h 0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// Get Monday start of ISO week for given year & week
function getISOWeekStart(year: number, week: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const day = simple.getDay();
  const ISOweekStart = new Date(simple);
  // Adjust to Monday
  const diff = day <= 4 ? day - 1 : day - 8;
  ISOweekStart.setDate(simple.getDate() - diff);
  ISOweekStart.setHours(0, 0, 0, 0);
  return ISOweekStart;
}

// Format week range string e.g. May 4 - May 10, 2025
function formatWeekRange(startDate: Date): string {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const startStr = startDate.toLocaleDateString("en-US", options);
  const endStr = endDate.toLocaleDateString("en-US", {
    ...options,
    year: "numeric",
  });
  return `${startStr} - ${endStr}`;
}

// Helper to iterate dates between start and end inclusive
function* eachDay(start: Date, end: Date): Generator<Date> {
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    yield new Date(d);
  }
}
export {
  parseDate,
  formatDate,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  getISOWeek,
  formatDuration,
  getISOWeekStart,
  formatWeekRange,
  eachDay,
};
