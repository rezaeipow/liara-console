type DateInput = string | number | Date;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function createDateFormatter(locale?: string | string[]): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function createMonthDayTimeFormatter(locale?: string | string[]): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createTimeWithSecondsFormatter(locale?: string | string[]): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function createDateTimeFormatter(locale?: string | string[]): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatWith(formatter: Intl.DateTimeFormat, value: DateInput): string {
  return formatter.format(toDate(value));
}

