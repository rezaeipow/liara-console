import type { ActionFunctionArgs } from "react-router-dom";
import { AppsAPI } from "@/api/appsApi";

export type AppSettingsActionData = {
  ok?: boolean;
  message?: string;
  formError?: string;
  fieldErrors?: {
    name?: string;
  };
  updatedName?: string;
};

export async function appSettingsAction({
  request,
  params,
}: ActionFunctionArgs): Promise<AppSettingsActionData> {
  const appId = String(params.appId ?? "").trim();
  if (!appId) return { formError: "App id is required." };

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "").trim();

  if (intent === "rename") {
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 3 || name.length > 32) {
      return {
        fieldErrors: { name: "Name must be between 3 and 32 characters." },
      };
    }

    try {
      const updated = await AppsAPI.rename(appId, { name });
      return { ok: true, message: "App renamed.", updatedName: updated.name };
    } catch (error: unknown) {
      return {
        formError:
          error instanceof Error ? error.message : "Could not rename app.",
      };
    }
  }

  return { formError: "Unsupported action." };
}
