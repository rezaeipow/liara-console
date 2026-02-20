import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, db } from "../data/db";

export const vmHandlers: HttpHandler[] = [
  http.get("/projects/:projectId/vms", ({ params }) => {
    const items = db.vms.filter((v) => v.projectId === params.projectId);
    return HttpResponse.json({ items });
  }),

  http.post("/projects/:projectId/vms", async ({ params, request }) => {
    const body = (await request.json()) as {
      name?: string;
      cpu?: number;
      ram?: number;
      disk?: number;
    };

    if (!body.name || !body.cpu || !body.ram || !body.disk) {
      return HttpResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const vm = {
      id: createId("vm"),
      projectId: String(params.projectId),
      name: body.name.trim(),
      status: "stopped" as const,
      cpu: body.cpu,
      ram: body.ram,
      disk: body.disk,
    };

    db.vms.unshift(vm);
    return HttpResponse.json(vm, { status: 201 });
  }),

  http.get("/vms/:vmId", ({ params }) => {
    const vm = db.vms.find((v) => v.id === params.vmId);
    if (!vm) {
      return HttpResponse.json({ message: "vm not found" }, { status: 404 });
    }
    return HttpResponse.json(vm);
  }),

  http.post("/vms/:vmId/start", ({ params }) => {
    const vm = db.vms.find((v) => v.id === params.vmId);
    if (!vm) return HttpResponse.json({ message: "vm not found" }, { status: 404 });
    vm.status = "running";
    return HttpResponse.json({ success: true });
  }),

  http.post("/vms/:vmId/stop", ({ params }) => {
    const vm = db.vms.find((v) => v.id === params.vmId);
    if (!vm) return HttpResponse.json({ message: "vm not found" }, { status: 404 });
    vm.status = "stopped";
    return HttpResponse.json({ success: true });
  }),

  http.post("/vms/:vmId/reboot", ({ params }) => {
    const vm = db.vms.find((v) => v.id === params.vmId);
    if (!vm) return HttpResponse.json({ message: "vm not found" }, { status: 404 });
    vm.status = "running";
    return HttpResponse.json({ success: true });
  }),

  http.patch("/vms/:vmId", async ({ params, request }) => {
    const vmId = String(params.vmId ?? "").trim();
    const body = (await request.json()) as { name?: string };
    const name = String(body.name ?? "").trim();

    const vm = db.vms.find((item) => item.id === vmId);
    if (!vm) return HttpResponse.json({ message: "vm not found" }, { status: 404 });
    if (name.length < 3 || name.length > 32) {
      return HttpResponse.json(
        { message: "Name must be between 3 and 32 characters." },
        { status: 400 },
      );
    }

    vm.name = name;
    return HttpResponse.json(vm);
  }),

  http.delete("/vms/:vmId", ({ params }) => {
    const next = db.vms.filter((v) => v.id !== params.vmId);
    if (next.length === db.vms.length) {
      return HttpResponse.json({ message: "vm not found" }, { status: 404 });
    }
    db.vms = next;
    return new HttpResponse(null, { status: 204 });
  }),
];
