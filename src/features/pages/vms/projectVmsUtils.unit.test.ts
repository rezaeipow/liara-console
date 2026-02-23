import { createTheme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";
import type { Vm } from "@/api/types";
import {
  formatMemory,
  getConfirmDialogContent,
  getFilteredVms,
  getProjectVmsErrorMessage,
  getProjectVmsSummary,
  getVmStatusChipSelectedSx,
} from "./projectVmsUtils";

const vms: Vm[] = [
  { id: "vm-1", projectId: "p-1", name: "api", status: "running", cpu: 2, ram: 2048, disk: 40 },
  { id: "vm-2", projectId: "p-1", name: "db", status: "stopped", cpu: 4, ram: 4096, disk: 80 },
  { id: "vm-3", projectId: "p-1", name: "worker", status: "running", cpu: 8, ram: 8192, disk: 100 },
];

describe("projectVmsUtils", () => {
  it("formats memory to gb", () => {
    expect(formatMemory(2048)).toBe("2.0 GB");
  });

  it("filters by query and status", () => {
    const result = getFilteredVms(vms, "wo", "running", "name-asc");
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("vm-3");
  });

  it("sorts by cpu and ram", () => {
    expect(getFilteredVms(vms, "", "all", "cpu-desc")[0]?.id).toBe("vm-3");
    expect(getFilteredVms(vms, "", "all", "ram-desc")[0]?.id).toBe("vm-3");
  });

  it("builds vms summary", () => {
    expect(getProjectVmsSummary(vms)).toEqual({
      total: 3,
      running: 2,
      stopped: 1,
      totalCpu: 14,
      totalRam: 14336,
    });
  });

  it("extracts error messages", () => {
    expect(
      getProjectVmsErrorMessage({ status: 500, data: { message: "backend failed" } }),
    ).toBe("backend failed");
    expect(getProjectVmsErrorMessage({ message: "serialized" })).toBe(
      "Could not load virtual machines.",
    );
  });

  it("returns selected chip styles by status", () => {
    const theme = createTheme();
    const stopped = getVmStatusChipSelectedSx(theme, "stopped");
    const running = getVmStatusChipSelectedSx(theme, "running");
    expect(stopped).toHaveProperty("backgroundColor");
    expect(running).toHaveProperty("backgroundColor");
  });

  it("builds confirm dialog content per action", () => {
    expect(getConfirmDialogContent("delete", "vm-api")).toEqual({
      title: "Delete VM",
      message: "Delete vm-api? This action is destructive and cannot be undone.",
    });
    expect(getConfirmDialogContent("start", "vm-api").title).toBe("Start VM");
  });
});

