import { Alert, Stack, useTheme } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import VmMetricSeriesCard from "./components/VmMetricSeriesCard";
import VmMetricsHeader from "./components/VmMetricsHeader";
import VmMetricsLoading from "./components/VmMetricsLoading";
import type { VmLayoutContext } from "./pageTypes";
import { useVmMetricsState } from "./useVmMetricsState";

export default function VmMetricsPage() {
  const theme = useTheme();
  const { vmId } = useParams();
  const { vm, isLoading, error } = useOutletContext<VmLayoutContext>();
  const state = useVmMetricsState(vmId, vm);

  if (isLoading) return <VmMetricsLoading />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!vm) return <Alert severity="warning">VM data is not available.</Alert>;

  return (
    <Stack spacing={1.5}>
      <VmMetricsHeader theme={theme} vmName={vm.name} range={state.range} refreshing={state.refreshing} onRangeChange={state.setRange} onRefresh={state.handleRefresh} cpu={vm.cpu} ram={vm.ram} disk={vm.disk} />
      <VmMetricSeriesCard title="CPU Utilization" series={state.cpuPercent} />
      <VmMetricSeriesCard title="Memory Utilization" color="secondary" series={state.ramPercent} />
      <VmMetricSeriesCard title="Disk Utilization" color="warning" series={state.diskPercent} />
    </Stack>
  );
}
