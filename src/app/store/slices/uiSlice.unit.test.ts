import { describe, expect, it } from "vitest";
import uiReducer, {
  closeMobileSidebar,
  hideToast,
  openMobileSidebar,
  selectBillingCredit,
  selectMobileSidebarOpen,
  selectSidebarMode,
  selectTableDensity,
  selectToast,
  selectUIPreferences,
  selectUnreadNotificationsCount,
  setBillingCredit,
  setSidebarMode,
  setTableDensity,
  setUnreadNotificationsCount,
  showToast,
  toggleSidebarMode,
} from "./uiSlice";

describe("uiSlice", () => {
  it("changes sidebar mode", () => {
    const state = uiReducer(undefined, setSidebarMode("collapsed"));
    expect(state.preferences.sidebarMode).toBe("collapsed");
  });

  it("toggles sidebar mode", () => {
    const first = uiReducer(undefined, toggleSidebarMode());
    const second = uiReducer(first, toggleSidebarMode());
    expect(first.preferences.sidebarMode).not.toBe(second.preferences.sidebarMode);
  });

  it("opens and closes mobile sidebar", () => {
    const opened = uiReducer(undefined, openMobileSidebar());
    const closed = uiReducer(opened, closeMobileSidebar());
    expect(opened.isMobileSidebarOpen).toBe(true);
    expect(closed.isMobileSidebarOpen).toBe(false);
  });

  it("changes table density", () => {
    const state = uiReducer(undefined, setTableDensity("compact"));
    expect(state.preferences.tableDensity).toBe("compact");
  });

  it("shows and hides toast", () => {
    const shown = uiReducer(undefined, showToast({ message: "saved", severity: "success" }));
    const hidden = uiReducer(shown, hideToast());
    expect(shown.toast.open).toBe(true);
    expect(shown.toast.message).toBe("saved");
    expect(hidden.toast.open).toBe(false);
  });

  it("normalizes unread notification count", () => {
    const state = uiReducer(undefined, setUnreadNotificationsCount(-4));
    expect(state.unreadNotificationsCount).toBe(0);
  });

  it("stores billing credit value", () => {
    const state = uiReducer(undefined, setBillingCredit(125000));
    expect(state.billingCredit).toBe(125000);
  });

  it("selectors return values from root ui state", () => {
    const ui = uiReducer(
      uiReducer(undefined, setSidebarMode("collapsed")),
      setTableDensity("comfortable"),
    );
    const root = { ui };
    expect(selectSidebarMode(root)).toBe("collapsed");
    expect(selectTableDensity(root)).toBe("comfortable");
    expect(selectUIPreferences(root)).toEqual({
      sidebarMode: "collapsed",
      tableDensity: "comfortable",
    });
    expect(selectMobileSidebarOpen(root)).toBe(false);
    expect(selectToast(root)).toEqual(ui.toast);
    expect(selectUnreadNotificationsCount(root)).toBe(ui.unreadNotificationsCount);
    expect(selectBillingCredit(root)).toBe(ui.billingCredit);
  });
});

