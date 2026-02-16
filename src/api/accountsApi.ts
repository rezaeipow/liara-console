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
};

