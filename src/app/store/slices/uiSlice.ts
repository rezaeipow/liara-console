import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getStorageJson, setStorageJson } from "@/shared/utils/storage";
export type SidebarMode = "expanded" | "collapsed";
export type TableDensity = "compact" | "standard" | "comfortable";

export interface UIPreferences {
  sidebarMode: SidebarMode; // only for sm/md
  tableDensity: TableDensity;
}

type ToastSeverity = "success" | "error" | "info" | "warning";

interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

interface UIState {
  preferences: UIPreferences;

  // Runtime UI state (not persisted)
  isMobileSidebarOpen: boolean; // for xs drawer only
  toast: ToastState;
  unreadNotificationsCount: number;
  billingCredit: number | null;
}

const STORAGE_KEY = "console-ui-preferences";

/* -----------------------------
   Persistence Helpers
------------------------------ */

function loadPreferences(): UIPreferences {
  const parsed = getStorageJson<Partial<UIPreferences> | null>(STORAGE_KEY, null);
  if (!parsed) {
    return {
      sidebarMode: "expanded",
      tableDensity: "standard",
    };
  }
  return {
    sidebarMode: parsed.sidebarMode === "collapsed" ? "collapsed" : "expanded",
    tableDensity:
      parsed.tableDensity === "comfortable" ||
      parsed.tableDensity === "compact" ||
      parsed.tableDensity === "standard"
        ? parsed.tableDensity
        : "standard",
  };
}

function savePreferences(prefs: UIPreferences) {
  setStorageJson(STORAGE_KEY, prefs);
}

/* -----------------------------
   Initial State
------------------------------ */

const initialState: UIState = {
  preferences: loadPreferences(),
  isMobileSidebarOpen: false,
  toast: {
    open: false,
    message: "",
    severity: "success",
  },
  unreadNotificationsCount: 0,
  billingCredit: null,
};

/* -----------------------------
   Slice
------------------------------ */

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /* ========= SIDEBAR MODE (sm/md only) ========= */

    setSidebarMode(state, action: PayloadAction<SidebarMode>) {
      state.preferences.sidebarMode = action.payload;
      savePreferences(state.preferences);
    },

    toggleSidebarMode(state) {
      state.preferences.sidebarMode =
        state.preferences.sidebarMode === "expanded"
          ? "collapsed"
          : "expanded";
      savePreferences(state.preferences);
    },

    /* ========= MOBILE SIDEBAR (xs only) ========= */

    openMobileSidebar(state) {
      state.isMobileSidebarOpen = true;
    },

    closeMobileSidebar(state) {
      state.isMobileSidebarOpen = false;
    },

    /* ========= TABLE DENSITY ========= */

    setTableDensity(state, action: PayloadAction<TableDensity>) {
      state.preferences.tableDensity = action.payload;
      savePreferences(state.preferences);
    },

    showToast(
      state,
      action: PayloadAction<{ message: string; severity?: ToastSeverity }>,
    ) {
      state.toast.open = true;
      state.toast.message = action.payload.message;
      state.toast.severity = action.payload.severity ?? "success";
    },

    hideToast(state) {
      state.toast.open = false;
    },

    setUnreadNotificationsCount(state, action: PayloadAction<number>) {
      state.unreadNotificationsCount = action.payload >= 0 ? action.payload : 0;
    },

    setBillingCredit(state, action: PayloadAction<number | null>) {
      state.billingCredit = action.payload;
    },
  },
});

/* -----------------------------
   Actions
------------------------------ */

export const {
  setSidebarMode,
  toggleSidebarMode,
  openMobileSidebar,
  closeMobileSidebar,
  setTableDensity,
  showToast,
  hideToast,
  setUnreadNotificationsCount,
  setBillingCredit,
} = uiSlice.actions;

/* -----------------------------
   Selectors
------------------------------ */

export const selectSidebarMode = (state: { ui: UIState }) =>
  state.ui.preferences.sidebarMode;

export const selectTableDensity = (state: { ui: UIState }) =>
  state.ui.preferences.tableDensity;

export const selectUIPreferences = (state: { ui: UIState }) =>
  state.ui.preferences;

export const selectMobileSidebarOpen = (state: { ui: UIState }) =>
  state.ui.isMobileSidebarOpen;

export const selectToast = (state: { ui: UIState }) => state.ui.toast;
export const selectUnreadNotificationsCount = (state: { ui: UIState }) =>
  state.ui.unreadNotificationsCount;
export const selectBillingCredit = (state: { ui: UIState }) => state.ui.billingCredit;

export default uiSlice.reducer;
