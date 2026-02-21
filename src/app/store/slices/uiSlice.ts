import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export type SidebarMode = "expanded" | "collapsed";
export type TableDensity = "compact" | "standard" | "comfortable";
export type ThemeMode = "system" | "light" | "dark";

export interface UIPreferences {
  themeMode: ThemeMode;
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
}

const STORAGE_KEY = "console-ui-preferences";

/* -----------------------------
   Persistence Helpers
------------------------------ */

function loadPreferences(): UIPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error();
    const parsed = JSON.parse(raw) as Partial<UIPreferences>;
    return {
      themeMode:
        parsed.themeMode === "light" || parsed.themeMode === "dark" || parsed.themeMode === "system"
          ? parsed.themeMode
          : "system",
      sidebarMode: parsed.sidebarMode === "collapsed" ? "collapsed" : "expanded",
      tableDensity:
        parsed.tableDensity === "comfortable" ||
        parsed.tableDensity === "compact" ||
        parsed.tableDensity === "standard"
          ? parsed.tableDensity
          : "standard",
    };
  } catch {
    return {
      themeMode: "system",
      sidebarMode: "expanded",
      tableDensity: "standard",
    };
  }
}

function savePreferences(prefs: UIPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
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
};

/* -----------------------------
   Slice
------------------------------ */

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.preferences.themeMode = action.payload;
      savePreferences(state.preferences);
    },

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
  },
});

/* -----------------------------
   Actions
------------------------------ */

export const {
  setThemeMode,
  setSidebarMode,
  toggleSidebarMode,
  openMobileSidebar,
  closeMobileSidebar,
  setTableDensity,
  showToast,
  hideToast,
  setUnreadNotificationsCount,
} = uiSlice.actions;

/* -----------------------------
   Selectors
------------------------------ */

export const selectSidebarMode = (state: { ui: UIState }) =>
  state.ui.preferences.sidebarMode;

export const selectTableDensity = (state: { ui: UIState }) =>
  state.ui.preferences.tableDensity;

export const selectThemeMode = (state: { ui: UIState }) =>
  state.ui.preferences.themeMode;

export const selectUIPreferences = (state: { ui: UIState }) =>
  state.ui.preferences;

export const selectMobileSidebarOpen = (state: { ui: UIState }) =>
  state.ui.isMobileSidebarOpen;

export const selectToast = (state: { ui: UIState }) => state.ui.toast;
export const selectUnreadNotificationsCount = (state: { ui: UIState }) =>
  state.ui.unreadNotificationsCount;

export default uiSlice.reducer;
