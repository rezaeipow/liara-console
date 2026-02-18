import { describe, expect, it } from "vitest";
import accountReducer, {
  addAccount,
  removeAccount,
  setAccounts,
  setActiveAccountId,
  updateAccountName,
  type Account,
} from "./accountSlice";

const seedAccounts: Account[] = [
  { id: "acc-1", name: "Team Account" },
  { id: "acc-2", name: "Personal Account" },
];

describe("accountSlice", () => {
  it("sets first account as active when activeAccountId is missing", () => {
    const state = accountReducer(
      undefined,
      setAccounts({ accounts: seedAccounts, activeAccountId: null }),
    );

    expect(state.accounts).toHaveLength(2);
    expect(state.activeAccountId).toBe("acc-1");
  });

  it("switches active account only when target exists", () => {
    const state = accountReducer(
      accountReducer(undefined, setAccounts({ accounts: seedAccounts, activeAccountId: "acc-1" })),
      setActiveAccountId("acc-2"),
    );

    expect(state.activeAccountId).toBe("acc-2");
  });

  it("adds account and keeps current active account", () => {
    const initial = accountReducer(
      undefined,
      setAccounts({ accounts: seedAccounts, activeAccountId: "acc-2" }),
    );
    const state = accountReducer(initial, addAccount({ id: "acc-3", name: "New Team" }));

    expect(state.accounts[0]?.id).toBe("acc-3");
    expect(state.activeAccountId).toBe("acc-2");
  });

  it("updates account name", () => {
    const initial = accountReducer(
      undefined,
      setAccounts({ accounts: seedAccounts, activeAccountId: "acc-1" }),
    );
    const state = accountReducer(
      initial,
      updateAccountName({ id: "acc-2", name: "Renamed Account" }),
    );

    expect(state.accounts.find((item) => item.id === "acc-2")?.name).toBe("Renamed Account");
  });

  it("reassigns active account after deleting active one", () => {
    const initial = accountReducer(
      undefined,
      setAccounts({ accounts: seedAccounts, activeAccountId: "acc-1" }),
    );
    const state = accountReducer(initial, removeAccount("acc-1"));

    expect(state.accounts).toHaveLength(1);
    expect(state.activeAccountId).toBe("acc-2");
  });
});
