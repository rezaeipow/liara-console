import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";
export type SidebarMode = "expanded" | "collapsed";

interface UIState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  sidebarMode: SidebarMode;
  tableDensity: "compact" | "standard" | "comfortable";
}

const initialState: UIState = {
  theme: "light",
  sidebarOpen: true,
  sidebarMode: "expanded",
  tableDensity: "standard",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSidebarMode: (state, action: PayloadAction<SidebarMode>) => {
      state.sidebarMode = action.payload;
    },
    setTableDensity: (
      state,
      action: PayloadAction<"compact" | "standard" | "comfortable">,
    ) => {
      state.tableDensity = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setSidebarMode,
  setTableDensity,
} = uiSlice.actions;

// selectors پایه
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectSidebarOpen = (state: { ui: UIState }) =>
  state.ui.sidebarOpen;
export const selectSidebarMode = (state: { ui: UIState }) =>
  state.ui.sidebarMode;
export const selectTableDensity = (state: { ui: UIState }) =>
  state.ui.tableDensity;

export default uiSlice.reducer;
