import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// نوع یک حساب
export interface Account {
  id: string;
  name: string;
  plan?: string;
  region?: string;
}

// نوع state
interface AccountState {
  accounts: Account[];
  activeAccountId: string | null;
}

const initialState: AccountState = {
  accounts: [],
  activeAccountId: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;

      // اگر activeAccountId null باشه و لیست غیرخالی باشه، اولین حساب فعال میشه
      if (!state.activeAccountId && action.payload.length > 0) {
        state.activeAccountId = action.payload[0].id;
      }
    },

    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);

      // اگر هنوز حساب فعال نداریم، این حساب رو فعال کن
      if (!state.activeAccountId) {
        state.activeAccountId = action.payload.id;
      }
    },

    switchAccount: (state, action: PayloadAction<string>) => {
      const exists = state.accounts.find(acc => acc.id === action.payload);
      if (exists) {
        state.activeAccountId = action.payload;
      }
    },

    removeAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);

      // اگر حساب فعال حذف شد، حساب بعدی یا null میشه
      if (state.activeAccountId === action.payload) {
        state.activeAccountId = state.accounts.length > 0 ? state.accounts[0].id : null;
      }
    },
  },
});

export const { setAccounts, addAccount, switchAccount, removeAccount } = accountSlice.actions;

// selectors پایه
export const selectAccounts = (state: { account: AccountState }) => state.account.accounts;
export const selectActiveAccountId = (state: { account: AccountState }) => state.account.activeAccountId;
export const selectActiveAccount = (state: { account: AccountState }) =>
  state.account.accounts.find(acc => acc.id === state.account.activeAccountId) || null;

export default accountSlice.reducer;
