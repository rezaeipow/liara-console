import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, db } from "../data/db";

export const ticketHandlers: HttpHandler[] = [
  http.get("/tickets", () => {
    return HttpResponse.json({ items: db.tickets });
  }),

  http.post("/tickets", async ({ request }) => {
    const body = (await request.json()) as {
      subject?: string;
      category?: string;
      body?: string;
    };

    if (!body.subject || !body.category || !body.body) {
      return HttpResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const ticket = {
      id: createId("t"),
      subject: body.subject,
      category: body.category,
      body: body.body,
      status: "open" as const,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    db.tickets.unshift(ticket);
    return HttpResponse.json(ticket, { status: 201 });
  }),

  http.get("/tickets/:ticketId", ({ params }) => {
    const ticket = db.tickets.find((t) => t.id === params.ticketId);
    if (!ticket) {
      return HttpResponse.json({ message: "ticket not found" }, { status: 404 });
    }

    return HttpResponse.json(ticket);
  }),

  http.post("/tickets/:ticketId/replies", async ({ params, request }) => {
    const ticket = db.tickets.find((t) => t.id === params.ticketId);
    if (!ticket) {
      return HttpResponse.json({ message: "ticket not found" }, { status: 404 });
    }

    const body = (await request.json()) as { body?: string };
    if (!body.body) {
      return HttpResponse.json({ message: "body is required" }, { status: 400 });
    }

    const reply = {
      id: createId("rep"),
      body: body.body,
      createdAt: new Date().toISOString(),
      author: "user" as const,
    };

    ticket.replies.push(reply);
    return HttpResponse.json(reply, { status: 201 });
  }),
];
