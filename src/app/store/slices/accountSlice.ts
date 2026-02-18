import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../Index";

export interface Account {
  id: string;
  name: string;
  plan?: string;
  region?: string;
}

interface AccountState {
  accounts: Account[];
  activeAccountId: string | null;
}

const STORAGE_KEY = "console-active-account-id";

function readPersistedActiveAccount(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persistActiveAccountId(value: string | null) {
  try {
    if (!value) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore storage errors
  }
}

const initialState: AccountState = {
  accounts: [],
  activeAccountId: readPersistedActiveAccount(),
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts(
      state,
      action: PayloadAction<{ accounts: Account[]; activeAccountId?: string | null }>,
    ) {
      state.accounts = action.payload.accounts;

      const incomingActive = action.payload.activeAccountId ?? state.activeAccountId;
      const resolvedActive =
        incomingActive && state.accounts.some((item) => item.id === incomingActive)
          ? incomingActive
          : state.accounts[0]?.id ?? null;

      state.activeAccountId = resolvedActive;
      persistActiveAccountId(resolvedActive);
    },

    addAccount(state, action: PayloadAction<Account>) {
      state.accounts.unshift(action.payload);
      if (!state.activeAccountId) {
        state.activeAccountId = action.payload.id;
        persistActiveAccountId(state.activeAccountId);
      }
    },

    setActiveAccountId(state, action: PayloadAction<string>) {
      const exists = state.accounts.some((item) => item.id === action.payload);
      if (!exists) return;
      state.activeAccountId = action.payload;
      persistActiveAccountId(state.activeAccountId);
    },

    updateAccountName(state, action: PayloadAction<{ id: string; name: string }>) {
      const target = state.accounts.find((item) => item.id === action.payload.id);
      if (!target) return;
      target.name = action.payload.name;
    },

    removeAccount(state, action: PayloadAction<string>) {
      state.accounts = state.accounts.filter((item) => item.id !== action.payload);
      if (state.activeAccountId === action.payload) {
        state.activeAccountId = state.accounts[0]?.id ?? null;
        persistActiveAccountId(state.activeAccountId);
      }
    },
  },
});

export const { setAccounts, addAccount, setActiveAccountId, updateAccountName, removeAccount } =
  accountSlice.actions;

export const selectAccounts = (state: RootState) => state.account.accounts;
export const selectActiveAccountId = (state: RootState) => state.account.activeAccountId;
export const selectActiveAccount = (state: RootState) =>
  state.account.accounts.find((item) => item.id === state.account.activeAccountId) ?? null;

export default accountSlice.reducer;
