export function formatIrr(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(value)} IRR`;
}

export function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
