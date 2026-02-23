import { http, HttpResponse, type HttpHandler } from "msw";
import { createId, db, persistRuntimeState } from "@/mocks/data/db";

function nextDeploymentVersion(appId: string) {
  const versions = db.deployments
    .filter((item) => item.appId === appId)
    .map((item) => {
      const match = /^v(\d+)$/i.exec(item.version.trim());
      return match ? Number(match[1]) : 0;
    });
  const maxVersion = versions.length > 0 ? Math.max(...versions) : 0;
  return `v${maxVersion + 1}`;
}

export const appHandlers: HttpHandler[] = [
  http.get("/projects/:projectId/apps", ({ params }) => {
    const apps = db.apps.filter((a) => a.projectId === params.projectId);
    return HttpResponse.json({ items: apps });
  }),

  http.post("/projects/:projectId/apps", async ({ params, request }) => {
    const body = (await request.json()) as { name?: string; region?: string; plan?: string };
    if (!body.name || !body.region || !body.plan) {
      return HttpResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const app = {
      id: createId("app"),
      projectId: String(params.projectId),
      name: body.name,
      region: body.region,
      plan: body.plan,
      status: "deploying" as const,
    };

    db.apps.unshift(app);
    db.envByAppId[app.id] = [];
    db.deployments.unshift({
      id: createId("dep"),
      appId: app.id,
      version: nextDeploymentVersion(app.id),
      status: "success",
      createdAt: new Date().toISOString(),
    });
    persistRuntimeState();
    return HttpResponse.json(app, { status: 201 });
  }),

  http.get("/apps/:appId", ({ params }) => {
    const app = db.apps.find((a) => a.id === params.appId);
    if (!app) {
      return HttpResponse.json({ message: "app not found" }, { status: 404 });
    }
    return HttpResponse.json(app);
  }),

  http.get("/apps/:appId/deployments", ({ params }) => {
    const items = db.deployments.filter((d) => d.appId === params.appId);
    return HttpResponse.json({ items });
  }),

  http.get("/projects/:projectId/deployments", ({ params }) => {
    const appIds = db.apps.filter((app) => app.projectId === params.projectId).map((app) => app.id);
    const items = db.deployments.filter((deployment) => appIds.includes(deployment.appId));
    return HttpResponse.json({ items });
  }),

  http.get("/apps/:appId/env", ({ params }) => {
    const env = db.envByAppId[String(params.appId)] ?? [];
    return HttpResponse.json({ items: env });
  }),

  http.put("/apps/:appId/env", async ({ params, request }) => {
    const body = (await request.json()) as { items?: Array<{ key: string; value: string; secret?: boolean }> };
    if (!Array.isArray(body.items)) {
      return HttpResponse.json({ message: "items array is required" }, { status: 400 });
    }

    db.envByAppId[String(params.appId)] = body.items;
    return HttpResponse.json({ success: true });
  }),

  http.get("/apps/:appId/logs", ({ request, params }) => {
    const url = new URL(request.url);
    const level = url.searchParams.get("level") ?? "info";
    return HttpResponse.json({
      items: [
        { id: createId("log"), appId: params.appId, level, message: "Application started" },
        { id: createId("log"), appId: params.appId, level, message: "Healthcheck passed" },
      ],
    });
  }),

  http.post("/apps/:appId/restart", ({ params }) => {
    const app = db.apps.find((a) => a.id === params.appId);
    if (!app) {
      return HttpResponse.json({ message: "app not found" }, { status: 404 });
    }

    app.status = "deploying";
    db.deployments.unshift({
      id: createId("dep"),
      appId: app.id,
      version: nextDeploymentVersion(app.id),
      status: "running",
      createdAt: new Date().toISOString(),
    });
    persistRuntimeState();
    return HttpResponse.json({ success: true });
  }),

  http.patch("/apps/:appId", async ({ params, request }) => {
    const appId = String(params.appId ?? "").trim();
    const body = (await request.json()) as { name?: string };
    const name = String(body.name ?? "").trim();

    const app = db.apps.find((item) => item.id === appId);
    if (!app) {
      return HttpResponse.json({ message: "app not found" }, { status: 404 });
    }
    if (name.length < 3 || name.length > 32) {
      return HttpResponse.json(
        { message: "Name must be between 3 and 32 characters." },
        { status: 400 },
      );
    }

    app.name = name;
    persistRuntimeState();
    return HttpResponse.json(app);
  }),

  http.delete("/apps/:appId", ({ params }) => {
    const next = db.apps.filter((a) => a.id !== params.appId);
    if (next.length === db.apps.length) {
      return HttpResponse.json({ message: "app not found" }, { status: 404 });
    }

    db.apps = next;
    db.deployments = db.deployments.filter((item) => item.appId !== params.appId);
    delete db.envByAppId[String(params.appId)];
    persistRuntimeState();
    return new HttpResponse(null, { status: 204 });
  }),
];
