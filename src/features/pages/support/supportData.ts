import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { ApiError } from "../../../api/httpClient";
import { TicketsAPI } from "../../../api/ticketsApi";
import type { Ticket } from "../../../api/types";

export type TicketsLoaderData = {
  items: Ticket[];
};

export type NewTicketLoaderData = {
  categories: string[];
};

export type TicketDetailLoaderData = {
  ticket: Ticket;
};

export type TicketActionData = {
  formError?: string;
  errorStatus?: number;
  errorHint?: string;
  fieldErrors?: {
    subject?: string;
    category?: string;
    body?: string;
    replyBody?: string;
  };
  successMessage?: string;
  successAt?: number;
};

const ticketCategories = [
  "apps",
  "vms",
  "billing",
  "account",
  "network",
  "general",
];

function mapStatusText(status: number): string {
  if (status === 408) return "Request Timeout";
  if (status === 401) return "Unauthorized";
  if (status === 403) return "Forbidden";
  if (status === 404) return "Not Found";
  if (status >= 500) return "Server Error";
  return "Request Failed";
}

function mapStatusHint(status: number): string {
  if (status === 408) return "The request timed out. Please retry.";
  if (status === 401) return "Your session may be expired. Please login again.";
  if (status === 403) return "You do not have permission to access this ticket resource.";
  if (status === 404) return "Ticket resource not found.";
  if (status >= 500) return "Server problem detected. Retry in a few moments.";
  return "Please check your request and try again.";
}

function toRouteErrorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return new Response(error.message, {
      status: error.status,
      statusText: mapStatusText(error.status),
    });
  }

  return new Response("Unexpected error", {
    status: 500,
    statusText: "Server Error",
  });
}

function normalizeText(input: FormDataEntryValue | null): string {
  return typeof input === "string" ? input.trim() : "";
}

export async function ticketsLoader({ request }: LoaderFunctionArgs): Promise<TicketsLoaderData> {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const unresolvedOnly = url.searchParams.get("unresolved") === "1";
    const sort = url.searchParams.get("sort") ?? "newest";
    const query = (url.searchParams.get("q") ?? "").trim().toLowerCase();
    const { items } = await TicketsAPI.list();

    const filteredByStatus =
      status === "open" || status === "pending" || status === "closed"
        ? items.filter((item) => item.status === status)
        : items;

    const filtered = query
      ? filteredByStatus.filter(
          (item) =>
            item.subject.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.body.toLowerCase().includes(query),
        )
      : filteredByStatus;

    const filteredByCategory = category
      ? filtered.filter((item) => item.category.toLowerCase() === category.toLowerCase())
      : filtered;

    const filteredByResolution = unresolvedOnly
      ? filteredByCategory.filter((item) => item.status !== "closed")
      : filteredByCategory;

    const sorted = [...filteredByResolution].sort((left, right) => {
      if (sort === "oldest") {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      }
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

    return { items: sorted };
  } catch (error) {
    throw toRouteErrorResponse(error);
  }
}

export async function newTicketLoader(): Promise<NewTicketLoaderData> {
  return { categories: ticketCategories };
}

export async function newTicketAction({
  request,
}: ActionFunctionArgs): Promise<TicketActionData | Response> {
  const formData = await request.formData();
  const subject = normalizeText(formData.get("subject"));
  const category = normalizeText(formData.get("category"));
  const body = normalizeText(formData.get("body"));

  const fieldErrors: TicketActionData["fieldErrors"] = {};
  if (subject.length < 4) {
    fieldErrors.subject = "Subject must be at least 4 characters.";
  }
  if (!ticketCategories.includes(category)) {
    fieldErrors.category = "Please choose a valid category.";
  }
  if (body.length < 10) {
    fieldErrors.body = "Description must be at least 10 characters.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    const ticket = await TicketsAPI.create({ subject, category, body });
    return redirect(`/console/support/tickets/${ticket.id}?created=1`);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        formError: error.message,
        errorStatus: error.status,
        errorHint: mapStatusHint(error.status),
      };
    }
    return {
      formError: error instanceof Error ? error.message : "Could not create ticket.",
      errorStatus: 500,
      errorHint: mapStatusHint(500),
    };
  }
}

export async function ticketDetailLoader({
  params,
}: LoaderFunctionArgs): Promise<TicketDetailLoaderData> {
  const ticketId = String(params.ticketId ?? "").trim();
  if (!ticketId) {
    throw new Response("Ticket id is required", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const ticket = await TicketsAPI.getById(ticketId);
    return { ticket };
  } catch (error) {
    throw toRouteErrorResponse(error);
  }
}

export async function ticketDetailAction({
  request,
  params,
}: ActionFunctionArgs): Promise<TicketActionData> {
  const ticketId = String(params.ticketId ?? "").trim();
  const formData = await request.formData();
  const replyBody = normalizeText(formData.get("replyBody"));

  if (!ticketId) {
    return {
      formError: "Ticket id is missing.",
      errorStatus: 400,
      errorHint: mapStatusHint(400),
    };
  }

  if (replyBody.length < 2) {
    return {
      fieldErrors: { replyBody: "Reply must be at least 2 characters." },
    };
  }

  try {
    await TicketsAPI.reply(ticketId, replyBody);
    return {
      successMessage: "Reply sent successfully.",
      successAt: Date.now(),
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        formError: error.message,
        errorStatus: error.status,
        errorHint: mapStatusHint(error.status),
      };
    }
    return {
      formError: error instanceof Error ? error.message : "Could not send reply.",
      errorStatus: 500,
      errorHint: mapStatusHint(500),
    };
  }
}
