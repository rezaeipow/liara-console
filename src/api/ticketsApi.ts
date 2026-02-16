import { request } from "./httpClient";
import type { Ticket, TicketReply } from "./types";

export const TicketsAPI = {
  list: () => request<{ items: Ticket[] }>("/tickets"),

  create: (payload: { subject: string; category: string; body: string }) =>
    request<Ticket>("/tickets", { method: "POST", body: payload }),

  getById: (ticketId: string) => request<Ticket>(`/tickets/${ticketId}`),

  reply: (ticketId: string, body: string) =>
    request<TicketReply>(`/tickets/${ticketId}/replies`, {
      method: "POST",
      body: { body },
    }),
};

