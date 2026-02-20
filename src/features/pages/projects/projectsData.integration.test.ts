import { describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs } from "react-router-dom";
import { ProjectsAPI } from "../../../api/projectsApi";
import { projectCreateAction, projectOverviewAction } from "./projectsData";

function buildRequest(url: string, form: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(form)) {
    params.set(key, value);
  }

  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params.toString(),
  });
}

describe("projectsData integration", () => {
  it("validates project creation fields", async () => {
    vi.spyOn(ProjectsAPI, "getMeta").mockResolvedValue({
      regions: ["de-fra"],
      plans: ["starter"],
    });

    const result = await projectCreateAction({
      request: buildRequest("http://localhost/console/projects/new", {
        intent: "create",
        name: "ab",
        region: "invalid",
        plan: "invalid",
      }),
    } as unknown as ActionFunctionArgs);

    if (result instanceof Response) {
      throw new Error("Expected validation errors, got redirect response.");
    }

    expect(result.fieldErrors?.name).toBeTruthy();
    expect(result.fieldErrors?.region).toBeTruthy();
    expect(result.fieldErrors?.plan).toBeTruthy();
  });

  it("creates project and redirects", async () => {
    vi.spyOn(ProjectsAPI, "getMeta").mockResolvedValue({
      regions: ["de-fra"],
      plans: ["starter"],
    });
    vi.spyOn(ProjectsAPI, "create").mockResolvedValue({
      id: "prj-99",
      accountId: "acc-1",
      name: "alpha",
      region: "de-fra",
      plan: "starter",
      createdAt: new Date().toISOString(),
    });

    const result = await projectCreateAction({
      request: buildRequest("http://localhost/console/projects/new", {
        intent: "create",
        name: "alpha",
        region: "de-fra",
        plan: "starter",
      }),
    } as unknown as ActionFunctionArgs);

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.headers.get("Location")).toBe("/console/projects/prj-99");
  });

  it("renames project", async () => {
    vi.spyOn(ProjectsAPI, "rename").mockResolvedValue({
      id: "prj-1",
      accountId: "acc-1",
      name: "renamed",
      region: "de-fra",
      plan: "starter",
      createdAt: new Date().toISOString(),
    });

    const result = await projectOverviewAction({
      params: { projectId: "prj-1" },
      request: buildRequest("http://localhost/console/projects/prj-1", {
        intent: "rename",
        name: "renamed",
      }),
    } as unknown as ActionFunctionArgs);

    if (result instanceof Response) {
      throw new Error("Expected rename action payload, got redirect response.");
    }

    expect(result.successMessage).toBe("Project renamed successfully.");
  });

  it("deletes project and redirects", async () => {
    vi.spyOn(ProjectsAPI, "remove").mockResolvedValue({ id: "prj-1" });

    const result = await projectOverviewAction({
      params: { projectId: "prj-1" },
      request: buildRequest("http://localhost/console/projects/prj-1", {
        intent: "delete",
      }),
    } as unknown as ActionFunctionArgs);

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.headers.get("Location")).toBe("/console/projects?deleted=1");
  });
});
