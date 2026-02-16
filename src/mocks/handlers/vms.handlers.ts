import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { db } from "../data/db";

export const vmHandlers: HttpHandler[] = [
  http.get("/projects/:projectId/vms", ({ params }) => {
    const items = db.vms.filter((v) => v.projectId === params.projectId);
    return HttpResponse.json({ items });
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

  http.delete("/vms/:vmId", ({ params }) => {
    const next = db.vms.filter((v) => v.id !== params.vmId);
    if (next.length === db.vms.length) {
      return HttpResponse.json({ message: "vm not found" }, { status: 404 });
    }
    db.vms = next;
    return new HttpResponse(null, { status: 204 });
  }),
];
