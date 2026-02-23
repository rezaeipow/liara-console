import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs } from "react-router-dom";
import { AccountsAPI } from "@/api/accountsApi";
import { store } from "@/app/store/index";
import { setAccounts } from "@/app/store/slices/accountSlice";
import { accountsAction } from "./accountsData";

const baseAccounts = [
  { id: "acc-1", name: "Team Account" },
  { id: "acc-2", name: "Personal Account" },
];

function buildRequest(form: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(form)) {
    params.set(key, value);
  }

  return new Request("http://localhost/console/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params.toString(),
  });
}

describe("accountsAction integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    store.dispatch(setAccounts({ accounts: baseAccounts, activeAccountId: "acc-1" }));
  });

  it("creates account and updates store", async () => {
    vi.spyOn(AccountsAPI, "create").mockResolvedValue({
      id: "acc-3",
      name: "New Workspace",
    });

    const result = await accountsAction({
      request: buildRequest({ intent: "create", name: "New Workspace" }),
    } as ActionFunctionArgs);

    expect(result.successMessage).toBe("Account created successfully.");
    expect(store.getState().account.accounts[0]?.id).toBe("acc-3");
  });

  it("switches active account", async () => {
    vi.spyOn(AccountsAPI, "switchActive").mockResolvedValue({
      activeAccountId: "acc-2",
    });

    const result = await accountsAction({
      request: buildRequest({ intent: "switch", accountId: "acc-2" }),
    } as ActionFunctionArgs);

    expect(result.successMessage).toBe("Active account switched.");
    expect(store.getState().account.activeAccountId).toBe("acc-2");
  });

  it("edits account name", async () => {
    vi.spyOn(AccountsAPI, "update").mockResolvedValue({
      id: "acc-2",
      name: "Renamed Team",
    });

    const result = await accountsAction({
      request: buildRequest({ intent: "edit", accountId: "acc-2", name: "Renamed Team" }),
    } as ActionFunctionArgs);

    expect(result.successMessage).toBe("Account updated successfully.");
    expect(
      store.getState().account.accounts.find((item) => item.id === "acc-2")?.name,
    ).toBe("Renamed Team");
  });

  it("deletes account and keeps active account valid", async () => {
    vi.spyOn(AccountsAPI, "remove").mockResolvedValue({
      id: "acc-1",
      activeAccountId: "acc-2",
    });

    const result = await accountsAction({
      request: buildRequest({ intent: "delete", accountId: "acc-1" }),
    } as ActionFunctionArgs);

    expect(result.successMessage).toBe("Account deleted successfully.");
    expect(store.getState().account.accounts).toHaveLength(1);
    expect(store.getState().account.activeAccountId).toBe("acc-2");
  });
});

