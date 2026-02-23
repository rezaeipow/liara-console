import { describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { ApiError } from "@/api/httpClient";
import { TicketsAPI } from "@/api/ticketsApi";
import {
  newTicketAction,
  ticketDetailAction,
  ticketDetailLoader,
  ticketsLoader,
} from "./supportData";

function buildRequest(url: string, form: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(form)) {
    params.set(key, value);
  }

  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: params.toString(),
  });
}

describe("supportData integration", () => {
  it("validates new ticket fields", async () => {
    const result = await newTicketAction({
      request: buildRequest("http://localhost/console/support/tickets/new", {
        subject: "a",
        category: "invalid",
        body: "short",
      }),
    } as unknown as ActionFunctionArgs);

    if (result instanceof Response) {
      throw new Error("Expected validation payload, got redirect.");
    }

    expect(result.fieldErrors?.subject).toContain("at least 4");
    expect(result.fieldErrors?.category).toContain("valid category");
    expect(result.fieldErrors?.body).toContain("at least 10");
  });

  it("creates ticket and redirects to detail page", async () => {
    vi.spyOn(TicketsAPI, "create").mockResolvedValue({
      id: "t-77",
      subject: "Deploy failed",
      category: "apps",
      body: "Build step timed out on release pipeline.",
      status: "open",
      createdAt: new Date().toISOString(),
      replies: [],
    });

    const result = await newTicketAction({
      request: buildRequest("http://localhost/console/support/tickets/new", {
        subject: "Deploy failed",
        category: "apps",
        body: "Build step timed out on release pipeline.",
      }),
    } as unknown as ActionFunctionArgs);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).headers.get("Location")).toBe(
      "/console/support/tickets/t-77?created=1",
    );
  });

  it("maps api error in new ticket action", async () => {
    vi.spyOn(TicketsAPI, "create").mockRejectedValue(new ApiError(500, "Server Error"));

    const result = await newTicketAction({
      request: buildRequest("http://localhost/console/support/tickets/new", {
        subject: "Deploy failed",
        category: "apps",
        body: "Build step timed out on release pipeline.",
      }),
    } as unknown as ActionFunctionArgs);

    if (result instanceof Response) {
      throw new Error("Expected action error payload, got redirect.");
    }

    expect(result.formError).toBe("Server Error");
    expect(result.errorStatus).toBe(500);
  });

  it("validates reply body in ticket detail action", async () => {
    const result = await ticketDetailAction({
      params: { ticketId: "t-1" },
      request: buildRequest("http://localhost/console/support/tickets/t-1", { replyBody: " " }),
    } as unknown as ActionFunctionArgs);

    expect(result.fieldErrors?.replyBody).toContain("at least 2");
  });

  it("returns success payload for valid reply", async () => {
    vi.spyOn(TicketsAPI, "reply").mockResolvedValue({
      id: "rep-1",
      body: "Investigating now.",
      author: "user",
      createdAt: new Date().toISOString(),
    });

    const result = await ticketDetailAction({
      params: { ticketId: "t-1" },
      request: buildRequest("http://localhost/console/support/tickets/t-1", {
        replyBody: "Investigating now.",
      }),
    } as unknown as ActionFunctionArgs);

    expect(result.successMessage).toBe("Reply sent successfully.");
    expect(typeof result.successAt).toBe("number");
  });

  it("filters tickets by status and query", async () => {
    vi.spyOn(TicketsAPI, "list").mockResolvedValue({
      items: [
        {
          id: "t-1",
          subject: "Deploy failed",
          category: "apps",
          body: "build timeout",
          status: "open",
          createdAt: "2026-02-21T12:00:00.000Z",
          replies: [],
        },
        {
          id: "t-2",
          subject: "Billing issue",
          category: "billing",
          body: "invoice mismatch",
          status: "closed",
          createdAt: "2026-02-20T12:00:00.000Z",
          replies: [],
        },
      ],
    });

    const result = await ticketsLoader({
      request: new Request("http://localhost/console/support/tickets?status=open&q=deploy"),
    } as unknown as LoaderFunctionArgs);

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe("t-1");
  });

  it("loads ticket detail and errors when ticketId is missing", async () => {
    vi.spyOn(TicketsAPI, "getById").mockResolvedValue({
      id: "t-1",
      subject: "Deploy failed",
      category: "apps",
      body: "build timeout",
      status: "open",
      createdAt: new Date().toISOString(),
      replies: [],
    });

    const ok = await ticketDetailLoader({
      params: { ticketId: "t-1" },
    } as unknown as LoaderFunctionArgs);
    expect(ok.ticket.id).toBe("t-1");

    await expect(
      ticketDetailLoader({ params: {} } as unknown as LoaderFunctionArgs),
    ).rejects.toBeInstanceOf(Response);
  });
});

