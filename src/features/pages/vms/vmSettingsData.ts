import type { ActionFunctionArgs } from "react-router-dom";
import { VmsAPI } from "../../../api/vmsApi";

export type VmSettingsActionData = {
  ok?: boolean;
  message?: string;
  formError?: string;
  fieldErrors?: {
    name?: string;
  };
  updatedName?: string;
};

export async function vmSettingsAction({
  request,
  params,
}: ActionFunctionArgs): Promise<VmSettingsActionData> {
  const vmId = String(params.vmId ?? "").trim();
  if (!vmId) return { formError: "VM id is required." };

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "").trim();

  if (intent === "rename") {
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 3 || name.length > 32) {
      return { fieldErrors: { name: "Name must be between 3 and 32 characters." } };
    }

    try {
      const updated = await VmsAPI.rename(vmId, { name });
      return { ok: true, message: "VM renamed.", updatedName: updated.name };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not rename VM.",
      };
    }
  }

  return { formError: "Unsupported action." };
}
