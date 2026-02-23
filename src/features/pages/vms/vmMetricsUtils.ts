export function buildSeries(seed: string, length: number, max: number) {
  const base = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Array.from({ length }).map((_, index) => {
    const wave = Math.sin((index + base) / 3) * 8;
    const noise = ((index * 13 + base) % 7) - 3;
    return Math.max(2, Math.min(max, Math.round(max * 0.45 + wave + noise)));
  });
}

export function normalizeSeries(series: number[], max: number) {
  return series.map((value) => Math.max(2, Math.min(100, Math.round((value / max) * 100))));
}
