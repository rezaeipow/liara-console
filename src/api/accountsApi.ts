import { request } from "./httpClient";
import type { Account } from "./types";

interface AccountsResponse {
  items: Account[];
  activeAccountId: string | null;
}

export const AccountsAPI = {
  list: () => request<AccountsResponse>("/accounts"),

  create: (payload: { name: string }) =>
    request<Account>("/accounts", { method: "POST", body: payload }),

  switchActive: (accountId: string) =>
    request<{ activeAccountId: string }>("/accounts/switch", {
      method: "POST",
      body: { accountId },
    }),

  update: (accountId: string, payload: { name: string }) =>
    request<Account>(`/accounts/${accountId}`, {
      method: "PUT",
      body: payload,
    }),

  remove: (accountId: string) =>
    request<{ id: string; activeAccountId: string | null }>(`/accounts/${accountId}`, {
      method: "DELETE",
    }),
};
