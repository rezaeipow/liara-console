import { useMemo, useState } from "react";
import type { Vm, } from "@/api/types";
import type { RangeKey } from "./pageTypes";
import { buildSeries, normalizeSeries } from "./vmMetricsUtils";

export function useVmMetricsState(vmId: string | undefined, vm: Vm | null) {
  const [range, setRange] = useState<RangeKey>("24h");
  const [refreshing, setRefreshing] = useState(false);
  const seriesLength = range === "1h" ? 12 : range === "24h" ? 24 : 28;
  const cpuSeries = useMemo(() => buildSeries(vmId ?? "vm", seriesLength, vm?.cpu ?? 4), [vmId, seriesLength, vm]);
  const ramSeries = useMemo(() => buildSeries(`${vmId}-ram`, seriesLength, vm?.ram ?? 4096), [vmId, seriesLength, vm]);
  const diskSeries = useMemo(() => buildSeries(`${vmId}-disk`, seriesLength, vm?.disk ?? 80), [vmId, seriesLength, vm]);
  const cpuPercent = useMemo(() => normalizeSeries(cpuSeries, vm?.cpu ?? 4), [cpuSeries, vm]);
  const ramPercent = useMemo(() => normalizeSeries(ramSeries, vm?.ram ?? 4096), [ramSeries, vm]);
  const diskPercent = useMemo(() => normalizeSeries(diskSeries, vm?.disk ?? 80), [diskSeries, vm]);
  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 650);
  };
  return { range, refreshing, setRange, handleRefresh, cpuPercent, ramPercent, diskPercent };
}
