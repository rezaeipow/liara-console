import { AccountsAPI } from "../../../api/accountsApi";
import { store } from "../../../app/store/Index";
import {
  addAccount,
  removeAccount,
  setAccounts,
  setActiveAccountId,
  updateAccountName,
} from "../../../app/store/slices/accountSlice";
import type { ActionFunctionArgs } from "react-router-dom";

type AccountsActionResult = {
  successMessage?: string;
  successAt?: number;
  formError?: string;
  fieldErrors?: {
    name?: string;
    accountId?: string;
  };
};

export type AccountsLoaderData = {
  initialLoadedAt: number;
};

export async function accountsLoader(): Promise<AccountsLoaderData> {
  const response = await AccountsAPI.list();
  store.dispatch(
    setAccounts({
      accounts: response.items,
      activeAccountId: response.activeAccountId,
    }),
  );

  return { initialLoadedAt: Date.now() };
}

export async function accountsAction({
  request,
}: ActionFunctionArgs): Promise<AccountsActionResult> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create") {
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 2) {
      return {
        fieldErrors: { name: "Account name must be at least 2 characters." },
      };
    }

    try {
      const account = await AccountsAPI.create({ name });
      store.dispatch(addAccount(account));
      return { successMessage: "Account created successfully.", successAt: Date.now() };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not create account.",
      };
    }
  }

  if (intent === "switch") {
    const accountId = String(formData.get("accountId") ?? "").trim();
    if (!accountId) {
      return {
        fieldErrors: { accountId: "Account id is required." },
      };
    }

    try {
      const response = await AccountsAPI.switchActive(accountId);
      store.dispatch(setActiveAccountId(response.activeAccountId));
      return { successMessage: "Active account switched.", successAt: Date.now() };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not switch account.",
      };
    }
  }

  if (intent === "edit") {
    const accountId = String(formData.get("accountId") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();

    if (!accountId) {
      return {
        fieldErrors: { accountId: "Account id is required." },
      };
    }

    if (name.length < 2) {
      return {
        fieldErrors: { name: "Account name must be at least 2 characters." },
      };
    }

    try {
      const account = await AccountsAPI.update(accountId, { name });
      store.dispatch(updateAccountName({ id: account.id, name: account.name }));
      return { successMessage: "Account updated successfully.", successAt: Date.now() };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not update account.",
      };
    }
  }

  if (intent === "delete") {
    const accountId = String(formData.get("accountId") ?? "").trim();
    if (!accountId) {
      return {
        fieldErrors: { accountId: "Account id is required." },
      };
    }

    try {
      const response = await AccountsAPI.remove(accountId);
      store.dispatch(removeAccount(response.id));
      if (response.activeAccountId) {
        store.dispatch(setActiveAccountId(response.activeAccountId));
      }
      return { successMessage: "Account deleted successfully.", successAt: Date.now() };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not delete account.",
      };
    }
  }

  return {
    formError: "Unsupported action.",
  };
}
