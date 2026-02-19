import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, db, paginate } from "../data/db";

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
