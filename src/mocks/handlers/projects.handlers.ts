import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, db, getActiveBilling, paginate } from "../data/db";

export const projectHandlers: HttpHandler[] = [
  http.get("/projects/meta", () => {
    const regions = [
      "de-fra",
      "nl-ams",
      "tr-ist",
      "ir-thr",
      "ae-dxb",
      "gb-lon",
      "us-nyc",
      "ca-tor",
      "sg-sin",
      "jp-tyo",
    ];
    const plans = ["starter", "basic", "pro", "business", "enterprise"];

    return HttpResponse.json({
      regions,
      plans,
    });
  }),

  http.get("/projects", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
    const query = (url.searchParams.get("q") ?? "").trim().toLowerCase();

    const projects = db.projects.filter((p) => {
      if (p.accountId !== db.activeAccountId) return false;
      if (!query) return true;
      return p.name.toLowerCase().includes(query);
    });
    return HttpResponse.json(paginate(projects, page, pageSize));
  }),

  http.post("/projects", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      region?: string;
      plan?: string;
    };

    if (!body.name || !body.region || !body.plan) {
      return HttpResponse.json({ message: "Invalid payload" }, { status: 400 });
    }
    const activeAccountId = db.activeAccountId ?? db.accounts[0]?.id;
    if (!activeAccountId) {
      return HttpResponse.json({ message: "No account available" }, { status: 400 });
    }

    const project = {
      id: createId("prj"),
      accountId: activeAccountId,
      name: body.name,
      region: body.region,
      plan: body.plan,
      createdAt: new Date().toISOString(),
    };

    db.projects.unshift(project);
    return HttpResponse.json(project, { status: 201 });
  }),

  http.get("/projects/:projectId", ({ params }) => {
    const project = db.projects.find((p) => p.id === params.projectId);
    if (!project) {
      return HttpResponse.json({ message: "project not found" }, { status: 404 });
    }

    const appCount = db.apps.filter((a) => a.projectId === project.id).length;
    const vmCount = db.vms.filter((v) => v.projectId === project.id).length;
    const now = Date.now();
    const activity = [
      {
        id: `${project.id}-act-1`,
        title: "Project created",
        createdAt: project.createdAt,
      },
      {
        id: `${project.id}-act-2`,
        title:
          appCount > 0
            ? `${appCount} app service${appCount > 1 ? "s" : ""} configured`
            : "No apps configured yet",
        createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
      },
      {
        id: `${project.id}-act-3`,
        title:
          vmCount > 0
            ? `${vmCount} VM instance${vmCount > 1 ? "s" : ""} attached`
            : "No VM instances attached",
        createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      },
    ];
    const billing = getActiveBilling();

    return HttpResponse.json({
      ...project,
      servicesSummary: { apps: appCount, vms: vmCount },
      billingSnapshot: { credit: billing.credit },
      activity,
    });
  }),

  http.patch("/projects/:projectId", async ({ params, request }) => {
    const projectId = String(params.projectId ?? "").trim();
    const name = String(((await request.json()) as { name?: string }).name ?? "").trim();
    const project = db.projects.find((item) => item.id === projectId);

    if (!project) {
      return HttpResponse.json({ message: "project not found" }, { status: 404 });
    }
    if (name.length < 3) {
      return HttpResponse.json(
        { message: "Project name must be at least 3 characters." },
        { status: 400 },
      );
    }

    project.name = name;
    return HttpResponse.json(project);
  }),

  http.delete("/projects/:projectId", ({ params }) => {
    const projectId = String(params.projectId ?? "").trim();
    const index = db.projects.findIndex((item) => item.id === projectId);

    if (index === -1) {
      return HttpResponse.json({ message: "project not found" }, { status: 404 });
    }

    db.projects.splice(index, 1);
    db.apps = db.apps.filter((item) => item.projectId !== projectId);
    db.vms = db.vms.filter((item) => item.projectId !== projectId);

    return HttpResponse.json({ id: projectId });
  }),
];
