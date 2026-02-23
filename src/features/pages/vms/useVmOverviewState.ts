import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VmsAPI } from "@/api/vmsApi";
import type { VmOverviewState } from "./pageTypes";

export function useVmOverviewState(): VmOverviewState {
  const { vmId } = useParams();
  const [vm, setVm] = useState<VmOverviewState["vm"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<VmOverviewState["actionLoading"]>(null);
  const [notice, setNotice] = useState<VmOverviewState["notice"]>(null);

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

  const runAction = async (type: "start" | "stop" | "reboot") => {
    if (!vm) return;
    setActionLoading(type);
    try {
      if (type === "start") {
        await VmsAPI.start(vm.id);
        setVm((prev) => (prev ? { ...prev, status: "running" } : prev));
        setNotice({ severity: "success", message: "VM started." });
      } else if (type === "stop") {
        await VmsAPI.stop(vm.id);
        setVm((prev) => (prev ? { ...prev, status: "stopped" } : prev));
        setNotice({ severity: "info", message: "VM stopped." });
      } else {
        await VmsAPI.reboot(vm.id);
        setVm((prev) => (prev ? { ...prev, status: "running" } : prev));
        setNotice({ severity: "info", message: "VM rebooted." });
      }
    } catch (requestError: unknown) {
      setNotice({
        severity: "error",
        message: requestError instanceof Error ? requestError.message : "Action failed.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return {
    vm,
    isLoading,
    error,
    actionLoading,
    notice,
    setNotice,
    runAction,
  };
}
