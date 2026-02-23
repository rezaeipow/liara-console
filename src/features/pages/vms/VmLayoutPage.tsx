import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import {
  ConsolePageShell,
  ConsoleResourceLayoutBody,
  ConsoleResourceLayoutHeader,
  ResourceStatusMetaChips,
} from "@/shared/components/console";
import { getVmStatusTone } from "@/shared/ui/statusTones";
import type { VmLayoutLoaderData } from "./vmsData";

const vmTabs = [
  { label: "Overview", path: "overview" },
  { label: "Metrics", path: "metrics" },
  { label: "Settings", path: "settings" },
];

export default function VmLayoutPage() {
  const { vm: loadedVm } = useLoaderData() as VmLayoutLoaderData;
  const [vm, setVm] = useState(loadedVm);

  useEffect(() => {
    setVm(loadedVm);
  }, [loadedVm]);

  const statusChipTone = vm?.status ? getVmStatusTone(vm.status) : "neutral";

  return (
    <ConsolePageShell spacing={2}>
      <ConsoleResourceLayoutHeader
        icon={<DnsOutlinedIcon />}
        title={vm?.name ?? "Virtual Machine"}
        badgeLabel="VM Console"
        backTo={vm?.projectId ? `/console/projects/${vm.projectId}/vms` : null}
        backLabel="Back to VMs List"
        tabs={vmTabs}
        isLoading={false}
        error={null}
        smTabColumns={3}
      />

      <ConsoleResourceLayoutBody
        chips={
          <ResourceStatusMetaChips
            statusLabel={vm?.status ?? "unknown"}
            statusTone={statusChipTone}
          >
            <Chip size="small" label={`${vm?.cpu ?? "-"} vCPU`} variant="outlined" />
            <Chip size="small" label={`${vm?.ram ? `${(vm.ram / 1024).toFixed(1)} GB` : "-"}`} variant="outlined" />
            <Chip size="small" label={`${vm?.disk ?? "-"} GB Disk`} variant="outlined" />
          </ResourceStatusMetaChips>
        }
      >
        <Outlet context={{ vm, isLoading: false, error: null, setVm }} />
      </ConsoleResourceLayoutBody>
    </ConsolePageShell>
  );
}
