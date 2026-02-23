import { describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs } from "react-router-dom";
import { ProjectsAPI } from "@/api/projectsApi";
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
  async function createProjectAndGetId(name: string) {
    vi.spyOn(ProjectsAPI, "getMeta").mockResolvedValue({
      regions: ["de-fra"],
      plans: ["starter"],
    });

    const created = await projectCreateAction({
      request: buildRequest("http://localhost/console/projects/new", {
        intent: "create",
        name,
        region: "de-fra",
        plan: "starter",
      }),
    } as unknown as ActionFunctionArgs);

    expect(created).toBeInstanceOf(Response);
    const location = (created as Response).headers.get("Location") ?? "";
    const projectId = location.split("/").pop() ?? "";
    expect(projectId.startsWith("prj-")).toBe(true);
    return projectId;
  }

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
    expect(response.headers.get("Location")).toMatch(/^\/console\/projects\/prj-/);
  });

  it("renames project", async () => {
    const projectId = await createProjectAndGetId("rename-target");

    const result = await projectOverviewAction({
      params: { projectId },
      request: buildRequest(`http://localhost/console/projects/${projectId}`, {
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
    const projectId = await createProjectAndGetId("delete-target");

    const result = await projectOverviewAction({
      params: { projectId },
      request: buildRequest(`http://localhost/console/projects/${projectId}`, {
        intent: "delete",
      }),
    } as unknown as ActionFunctionArgs);

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.headers.get("Location")).toBe("/console/projects?deleted=1");
  });
});
