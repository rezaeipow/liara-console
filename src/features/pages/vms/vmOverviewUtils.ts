export function formatMemory(mb: number) {
  return `${(mb / 1024).toFixed(1)} GB`;
}

export function deriveMockUsage(vmId: string, maxCpu: number, maxRam: number, maxDisk: number) {
  const hash = [...vmId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const cpuUsed = Math.max(1, Math.min(maxCpu, Math.round((hash % maxCpu) + 1)));
  const ramUsed = Math.max(256, Math.min(maxRam, Math.round((hash * 97) % maxRam)));
  const diskUsed = Math.max(4, Math.min(maxDisk, Math.round((hash * 13) % maxDisk)));
  return { cpuUsed, ramUsed, diskUsed };
}
