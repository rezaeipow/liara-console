import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, db, paginate } from "../data/db";

export const projectHandlers: HttpHandler[] = [
  http.get("/projects", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

    const projects = db.projects.filter((p) => p.accountId === db.activeAccountId);
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

    const project = {
      id: createId("prj"),
      accountId: db.activeAccountId,
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

    return HttpResponse.json({
      ...project,
      servicesSummary: { apps: appCount, vms: vmCount },
      billingSnapshot: { credit: db.credit },
      activity: [{ id: "act-1", title: "Project created" }],
    });
  }),
];
