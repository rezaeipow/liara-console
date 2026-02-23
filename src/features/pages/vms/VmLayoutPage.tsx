import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { VmsAPI } from "@/api/vmsApi";
import type { Vm } from "@/api/types";
import {
  ConsolePageShell,
  ConsoleResourceLayoutBody,
  ConsoleResourceLayoutHeader,
  ResourceStatusMetaChips,
} from "@/shared/components/console";
import { getVmStatusTone } from "@/shared/ui/statusTones";

const vmTabs = [
  { label: "Overview", path: "overview" },
  { label: "Metrics", path: "metrics" },
  { label: "Settings", path: "settings" },
];

export default function VmLayoutPage() {
  const { vmId } = useParams();
  const [vm, setVm] = useState<Vm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadVm = async () => {
      if (!vmId) {
        if (!active) return;
        setError("VM id is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await VmsAPI.getById(vmId);
        if (!active) return;
        setVm(response);
      } catch (requestError: unknown) {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Could not load VM.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadVm();

    return () => {
      active = false;
    };
  }, [vmId]);

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
        isLoading={isLoading}
        error={error}
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
        <Outlet context={{ vm, isLoading, error, setVm }} />
      </ConsoleResourceLayoutBody>
    </ConsolePageShell>
  );
}
