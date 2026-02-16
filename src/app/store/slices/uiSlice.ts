import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";
export type SidebarMode = "expanded" | "collapsed";
export type TableDensity = "compact" | "standard" | "comfortable";

export interface UIPreferences {
  theme: ThemeMode;
  sidebarMode: SidebarMode; // only for sm/md
  tableDensity: TableDensity;
}

interface UIState {
  preferences: UIPreferences;

  // Runtime UI state (not persisted)
  isMobileSidebarOpen: boolean; // for xs drawer only
}

const STORAGE_KEY = "console-ui-preferences";

/* -----------------------------
   Persistence Helpers
------------------------------ */

function loadPreferences(): UIPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error();
    return JSON.parse(raw);
  } catch {
    return {
      theme: "light",
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
};

/* -----------------------------
   Slice
------------------------------ */

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /* ========= THEME ========= */

    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.preferences.theme = action.payload;
      savePreferences(state.preferences);
    },

    toggleTheme(state) {
      state.preferences.theme =
        state.preferences.theme === "light" ? "dark" : "light";
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
  },
});

/* -----------------------------
   Actions
------------------------------ */

export const {
  setTheme,
  toggleTheme,
  setSidebarMode,
  toggleSidebarMode,
  openMobileSidebar,
  closeMobileSidebar,
  setTableDensity,
} = uiSlice.actions;

/* -----------------------------
   Selectors
------------------------------ */

export const selectTheme = (state: { ui: UIState }) =>
  state.ui.preferences.theme;

export const selectSidebarMode = (state: { ui: UIState }) =>
  state.ui.preferences.sidebarMode;

export const selectTableDensity = (state: { ui: UIState }) =>
  state.ui.preferences.tableDensity;

export const selectMobileSidebarOpen = (state: { ui: UIState }) =>
  state.ui.isMobileSidebarOpen;

export default uiSlice.reducer;
