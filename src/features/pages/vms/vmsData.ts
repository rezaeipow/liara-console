import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { store } from "@/app/store/index";
import { api } from "@/app/store/api";

export async function projectVmsLoader({ params }: LoaderFunctionArgs) {
  const projectId = String(params.projectId ?? "").trim();
  if (!projectId) {
    throw new Response("Project id is required", { status: 400 });
  }

  await store.dispatch(api.endpoints.getVmsByProject.initiate(projectId)).unwrap();
  return { projectId };
}

async function readActionFormData(request: Request) {
  try {
    return await request.formData();
  } catch {
    try {
      const raw = await request.clone().text();
      if (raw) {
        const params = new URLSearchParams(raw);
        const formData = new FormData();
        params.forEach((value, key) => {
          formData.append(key, value);
        });
        if (Array.from(formData.keys()).length > 0) {
          return formData;
        }
      }
    } catch {
      // continue to JSON fallback
    }

    try {
      const payload = (await request.clone().json()) as Record<string, unknown>;
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      return formData;
    } catch {
      return new FormData();
    }
  }
}

export type ProjectVmsActionData = {
  ok?: boolean;
  message?: string;
  formError?: string;
  fieldErrors?: {
    name?: string;
    cpu?: string;
    ram?: string;
    disk?: string;
  };
};

export async function projectVmsAction({
  request,
  params,
}: ActionFunctionArgs): Promise<ProjectVmsActionData> {
  const projectId = String(params.projectId ?? "").trim();
  if (!projectId) {
    return { formError: "Project id is required." };
  }

  const formData = await readActionFormData(request);
  const intent = String(formData.get("intent") ?? "").trim();

  if (intent === "create") {
    const name = String(formData.get("name") ?? "").trim();
    const cpu = Number(formData.get("cpu") ?? 0);
    const ram = Number(formData.get("ram") ?? 0);
    const disk = Number(formData.get("disk") ?? 0);

    const fieldErrors: ProjectVmsActionData["fieldErrors"] = {};
    if (name.length < 3) fieldErrors.name = "Name must be at least 3 characters.";
    if (!Number.isFinite(cpu) || cpu <= 0) fieldErrors.cpu = "CPU must be greater than 0.";
    if (!Number.isFinite(ram) || ram < 512) fieldErrors.ram = "RAM must be at least 512 MB.";
    if (!Number.isFinite(disk) || disk < 10) fieldErrors.disk = "Disk must be at least 10 GB.";

    if (fieldErrors.name || fieldErrors.cpu || fieldErrors.ram || fieldErrors.disk) {
      return { fieldErrors };
    }

    try {
      await store.dispatch(api.endpoints.createVm.initiate({ projectId, name, cpu, ram, disk })).unwrap();
      await store
        .dispatch(api.endpoints.getVmsByProject.initiate(projectId, { forceRefetch: true }))
        .unwrap();
      return { ok: true, message: "VM created." };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not create VM.",
      };
    }
  }

  if (intent === "delete") {
    const vmId = String(formData.get("vmId") ?? "").trim();
    if (!vmId) {
      return { formError: "VM id is required." };
    }

    try {
      await store.dispatch(api.endpoints.deleteVm.initiate({ vmId, projectId })).unwrap();
      await store
        .dispatch(api.endpoints.getVmsByProject.initiate(projectId, { forceRefetch: true }))
        .unwrap();
      return { ok: true, message: "VM deleted." };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not delete VM.",
      };
    }
  }

  return { formError: "Unsupported action." };
}

