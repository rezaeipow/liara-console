import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { db } from "../data/db";

export const notificationHandlers: HttpHandler[] = [
  http.get("/notifications", () => {
    return HttpResponse.json({ items: db.notifications });
  }),

  http.post("/notifications/:id/read", ({ params }) => {
    const notification = db.notifications.find((n) => n.id === params.id);
    if (!notification) {
      return HttpResponse.json({ message: "notification not found" }, { status: 404 });
    }

    notification.read = true;
    return HttpResponse.json({ success: true });
  }),

  http.post("/notifications/read-all", () => {
    db.notifications.forEach((n) => {
      n.read = true;
    });

    return HttpResponse.json({ success: true });
  }),
];
